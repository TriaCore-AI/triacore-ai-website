# Testbeeld van het vloeibare glas op scène 12, met de echte logo's en de hero-tekst, op de maten van de browser (schaal 1600/1920)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops
b = 'C:/TriaCore AI/Website/TriaCore AI gemini 3.1 website/src/assets/'
bron = [b + 'partners/Croes NV.png', b + 'partners/A&M Group.webp', b + 'klantcases/medtronic.png', b + 'klantcases/the-box.png']
bg = Image.open('schijven-raam_kaal.png').convert('RGB')
W, H = bg.size
s = W / 1920
hoog = int(54 * s)
logos = []
for p in bron:
    l = Image.open(p).convert('RGBA')
    w = min(int(l.width * hoog / l.height), int(190 * s))
    logos.append(l.resize((w, int(l.height * w / l.width)), Image.LANCZOS))
f = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', int(16 * s))
label = 'Onder meer voor'
lw = int(ImageDraw.Draw(bg).textlength(label, font=f))
gap1, gap2, pad = int(48 * s), int(52 * s), int(44 * s)
br = pad * 2 + lw + gap1 + sum(l.width for l in logos) + gap2 * 3
bh = hoog + int(32 * s)
x0, y0 = (W - br) // 2, int(778 * s)
# De glaslaag: inset -22px -72px, met uitvloeiende randen
ex, ey = int(72 * s), int(22 * s)
gx0, gy0, gw, gh = x0 - ex, y0 - ey, br + 2 * ex, bh + 2 * ey
yy, xx = np.mgrid[0:H, 0:W]
u = np.clip((xx - gx0) / gw, 0, 1); v = np.clip((yy - gy0) / gh, 0, 1)
mx = np.clip(np.minimum(u, 1 - u) / .16, 0, 1) * (((xx >= gx0) & (xx <= gx0 + gw)))
my = np.clip(np.minimum(v, 1 - v) / .34, 0, 1) * (((yy >= gy0) & (yy <= gy0 + gh)))
masker = (mx * my)[..., None]
# Een eenvoudige golving als benadering van de verplaatsing door het glas
a = np.asarray(bg).astype(float)
dx = (np.sin(yy * .05 + xx * .012) * 11 * s).astype(int)
dy = (np.sin(xx * .02) * 9 * s).astype(int)
gol = a[np.clip(yy + dy, 0, H - 1), np.clip(xx + dx, 0, W - 1)]
wazig = np.asarray(Image.fromarray(gol.astype(np.uint8)).filter(ImageFilter.GaussianBlur(5 * s))).astype(float)
wazig = np.clip(wazig * 1.04, 0, 255)
alfa = (.62 + (.46 - .62) * v)[..., None]
kl = np.array([250, 252, 253.0])
glas = wazig * (1 - alfa) + kl * alfa
uit = Image.fromarray((a * (1 - masker) + glas * masker).astype(np.uint8))
d = ImageDraw.Draw(uit)
x = x0 + pad
d.text((x, y0 + (bh - int(22 * s)) // 2), label, font=f, fill=(84, 90, 105))
x += lw + gap1
for l in logos:
    y = y0 + (bh - l.height) // 2
    vak = uit.crop((x, y, x + l.width, y + l.height))
    wit = Image.new('RGB', l.size, (255, 255, 255))
    wit.paste(l, mask=l.split()[3])
    uit.paste(ImageChops.multiply(vak, wit), (x, y))
    x += l.width + gap2
uit.crop((int(W * .1), int(H * .55), int(W * .9), H)).save('logotest.png')
