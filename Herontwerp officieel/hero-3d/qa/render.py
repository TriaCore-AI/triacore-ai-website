# Rendert de scènes op de GPU, zonder browser, met de hero-tekst erover om de leesbaarheid te beoordelen.
# Gebruik: render.py [id ...] [--mx x --my y --t sec --in v]
import json, sys, time, math, os
import moderngl, numpy as np
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]
def opt(n, d):
    if n in args:
        i = args.index(n); v = float(args[i + 1]); del args[i:i + 2]; return v
    return d
mx, my, tt, intro = opt('--mx', 0.0), opt('--my', 0.0), opt('--t', 8.0), opt('--in', 1.0)
hover = opt('--hover', None)
W, H = 1600, 860
scenes = json.load(open(os.path.join(D, 'scenes.json')))
if args: scenes = [s for s in scenes if s['id'] in args]

ctx = moderngl.create_standalone_context()
fbo = ctx.simple_framebuffer((W, H), components=4)
fbo.use()
VS = '#version 330\nvoid main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.0-1.0,0.0,1.0);}'
vao_empty = None

def tekst(img):
    d = ImageDraw.Draw(img, 'RGBA')
    s = W / 1920
    ti = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', int(112 * s))
    tg = ImageFont.truetype('C:/Windows/Fonts/georgiai.ttf', int(112 * s))
    z = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', int(23 * s))
    b = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', int(15 * s))
    fg = (15, 23, 42, 255)
    def mid(y, t, f, c):
        w = d.textlength(t, font=f); d.text(((W - w) / 2, y * s), t, font=f, fill=c)
    mid(185, 'AI voor operationele', ti, fg)
    mid(310, 'vooruitgang', tg, (98, 143, 105, 255))
    mid(470, 'AI die in uw processen werkt, niet ernaast. Met software', z, (15, 23, 42, 178))
    mid(506, 'op maat, workshops en begeleiding.', z, (15, 23, 42, 178))
    x0 = W / 2 - 200 * s
    d.rounded_rectangle([x0, 590 * s, x0 + 186 * s, 637 * s], radius=int(23 * s), fill=fg)
    d.text((x0 + 26 * s, 603 * s), 'Plan een gesprek  →', font=b, fill=(248, 250, 252, 255))
    d.text((x0 + 215 * s, 600 * s), 'Bekijk onze oplossingen  →', font=z, fill=(15, 23, 42, 178))
    d.text(((W - 110 * s) / 2 - 300 * s, 755 * s), 'Onder meer voor', font=z, fill=(15, 23, 42, 128))
    for i, n in enumerate(['Croes', 'A&M', 'Medtronic', 'The Box']):
        d.text((W / 2 - 80 * s + i * 150 * s, 745 * s), n, font=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', int(26 * s)), fill=(40, 40, 70, 255))
    # De menubalk
    d.rounded_rectangle([W / 2 - 500 * s, 24 * s, W / 2 + 500 * s, 96 * s], radius=int(36 * s), fill=(248, 250, 252, 170))

blad = []
for sc in scenes:
    fs = sc['fs'].replace('gl_FragColor', 'fragColor_')
    fs = '#version 330\nout vec4 fragColor_;\n#define texture2D texture\n' + fs
    try:
        pr = ctx.program(vertex_shader=VS, fragment_shader=fs)
    except Exception as e:
        print(sc['id'], 'COMPILEERFOUT', str(e)[:900]); continue
    def zet(n, v):
        if n in pr: pr[n].value = v
    ro = list(sc['ro']); ro[0] += mx * sc['muis'][0]; ro[1] += my * sc['muis'][1]
    l = np.array(sc['licht'], float); l /= np.linalg.norm(l)
    zet('uRes', (float(W), float(H))); zet('uT', tt); zet('uIn', intro); zet('uM', (mx, my))
    zet('uRo', tuple(ro)); zet('uTa', tuple(sc['ta'])); zet('uL', tuple(l)); zet('uLens', float(sc['lens']))
    if 'uKaart' in pr:
        d = np.zeros(64, dtype=np.uint8)
        if hover is not None:
            for off, w in ((0, 1.0), (1, .3), (-1, .3), (2, .07), (-2, .07)):
                d[int(hover) + 32 + off] = int(w * 255)
        tex = ctx.texture((64, 1), 1, d.tobytes(), alignment=1)
        tex.filter = (moderngl.NEAREST, moderngl.NEAREST)
        tex.repeat_x = False
        tex.use(0)
        pr['uKaart'].value = 0
    vao = ctx.vertex_array(pr, [])
    punten = None
    if sc.get('dp'):
        dp = sc['dp']
        vs2 = '#version 330\n' + dp['vs'].replace('attribute ', 'in ').replace('varying ', 'out ')
        fs2 = '#version 330\nout vec4 fragColor_;\n' + dp['fs'].replace('varying ', 'in ').replace('gl_FragColor', 'fragColor_')
        pp = ctx.program(vertex_shader=vs2, fragment_shader=fs2)
        for n, v in (('uRes', (float(W), float(H))), ('uT', tt), ('uIn', intro), ('uM', (mx, my)), ('uRo', tuple(ro)), ('uTa', tuple(sc['ta'])), ('uL', tuple(l)), ('uLens', float(sc['lens'])), ('uK', 1.25)):
            if n in pp: pp[n].value = v
        nx, ny = dp['nx'], dp['ny']
        ys, xs = np.mgrid[0:ny, 0:nx]
        ax = (xs + (ys % 2) * .5) / (nx - 1) * 2 - 1
        ay = ys / (ny - 1) * 2 - 1
        vbo = ctx.buffer(np.stack([ax, ay], axis=-1).astype('f4').tobytes())
        punten = (ctx.vertex_array(pp, [(vbo, '2f', 'a')]), nx * ny)
    def teken():
        fbo.clear()
        ctx.disable(moderngl.BLEND)
        vao.render(moderngl.TRIANGLES, vertices=3)
        if punten:
            ctx.enable(moderngl.BLEND | moderngl.PROGRAM_POINT_SIZE)
            ctx.blend_func = moderngl.SRC_ALPHA, moderngl.ONE_MINUS_SRC_ALPHA
            punten[0].render(moderngl.POINTS, vertices=punten[1])
        ctx.finish()
    teken()
    t0 = time.time()
    teken()
    ms = (time.time() - t0) * 1000
    a = np.frombuffer(fbo.read(components=3), dtype=np.uint8).reshape(H, W, 3)[::-1]
    # Masker onderaan: vloeit over in het verloop van de pagina
    pag = np.array([236, 241, 237], float)
    fade = np.clip((H - np.arange(H)) / (H * 0.14), 0, 1)[:, None, None]
    fade = fade * fade * (3 - 2 * fade)
    a2 = (a * fade + pag * (1 - fade)).astype(np.uint8)
    img = Image.fromarray(a2, 'RGB')
    img.save(os.path.join(D, f"{sc['id']}_kaal.png"))
    # Waarden: hoe licht is de scène achter de titel
    hoog = a[int(H * .18):int(H * .6), int(W * .25):int(W * .75)].mean(axis=2)
    print(f"{sc['id']:12s} {ms:6.1f} ms  titelzone min {hoog.min():.0f} gem {hoog.mean():.0f} max {hoog.max():.0f}")
    met = img.convert('RGBA'); tekst(met)
    met = met.convert('RGB'); met.save(os.path.join(D, f"{sc['id']}.png"))
    blad.append((sc['naam'], met))

if len(blad) > 1:
    tw, th = 780, int(780 * H / W)
    kol = 2
    rij = math.ceil(len(blad) / kol)
    sheet = Image.new('RGB', (kol * tw + (kol + 1) * 10, rij * (th + 10) + 10), (60, 60, 60))
    for i, (n, m) in enumerate(blad):
        sheet.paste(m.resize((tw, th), Image.LANCZOS), (10 + (i % kol) * (tw + 10), 10 + (i // kol) * (th + 10)))
    sheet.save(os.path.join(D, 'blad.png'))
