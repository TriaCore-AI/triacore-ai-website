// De rendermotor van de hero-varianten: één shader die een 3D-scène berekent als een witte studiorender,
// met zachte schaduwen en licht in de hoeken. Een scène levert enkel haar vorm (map) en haar instellingen.
// Bewust in GLSL ES 1.00: dat draait op elk toestel met WebGL, zonder bibliotheek.
(function (g) {
  var BOVEN = `
precision highp float;
uniform vec2 uRes;
uniform float uT;      // seconden sinds de start
uniform float uIn;     // intro, van 0 naar 1
uniform vec2 uM;       // muis, -1 tot 1 (y omhoog)
uniform vec3 uRo;
uniform vec3 uTa;
uniform vec3 uL;
uniform float uLens;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float kbox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, vec3(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float gE = 1000000.0;  // echte afstand tot de vorm, als de scène die apart zet
float kbox2(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - r;
}
`;

  var ONDER = `
// Geeft de echte afstand terug; gStap is hoe ver de marcher veilig mag springen
float gStap = 0.0;
float vorm(vec3 p) {
  gE = 1000000.0;
  gStap = map(p);
  return gE > 100000.0 ? gStap : gE;
}

vec3 normaal(vec3 p, float t) {
  vec2 e = vec2(1.0, -1.0) * max(0.0008, 0.0006 * t);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float schaduw(vec3 o, vec3 r) {
  float res = 1.0;
  float t = SCHADUW_START;
  for (int i = 0; i < SCHADUW_STAPPEN; i++) {
    float h = vorm(o + r * t);
    res = min(res, SCHADUW_K * h / t);
    t += clamp(gStap, 0.02, 0.35);
    if (res < 0.004 || t > SCHADUW_VER) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

float hoeklicht(vec3 p, vec3 n) {
  float o = 0.0, w = 1.0;
  for (int i = 1; i <= 5; i++) {
    float h = AO_BEREIK * float(i) / 5.0;
    o += w * (h - vorm(p + n * h));
    w *= 0.62;
  }
  return clamp(1.0 - AO_STERK * o, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 f = normalize(uTa - uRo);
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, f);
  vec3 rd = normalize(uv.x * r + uv.y * u + uLens * f);

  float t = START;
  bool raak = false;
  for (int i = 0; i < STAPPEN; i++) {
    float d = map(uRo + rd * t);
    if (d < 0.0006 * t) { raak = true; break; }
    t += d * STAP;
    if (t > VER) break;
  }

  vec3 papier = achter(uv);
  vec3 kl = papier;
  if (raak) {
    vec3 p = uRo + rd * t;
    vec3 n = normaal(p, t);
    vec3 alb = kleur(p, n);
    float dif = clamp(dot(n, uL), 0.0, 1.0);
    float sch = dif > 0.001 ? schaduw(p + n * SCHADUW_AF, uL) : 0.0;
    sch *= gobo(p);
    float ao = hoeklicht(p, n);
    float hemel = 0.5 + 0.5 * dot(n, HEMEL);
    vec3 lin = vec3(1.0, 0.985, 0.96) * KEY * dif * sch
             + vec3(0.965, 0.985, 1.0) * AMB * mix(HEMEL_MIN, 1.0, hemel) * ao
             + vec3(0.98, 1.0, 0.97) * 0.08 * clamp(0.5 - 0.5 * dot(n, uL), 0.0, 1.0) * ao;
    kl = alb * lin + gloed(p, n) * ao;
    kl = mix(kl, papier, 1.0 - exp(-NEVEL * t * t));
  }
  kl = pow(clamp(kl, 0.0, 1.0), vec3(1.0 / 2.2));
  // De scène wordt rustiger achter de tekst, zodat de titel altijd als eerste leest
  vec2 w = (uv - vec2(0.0, 0.09)) / vec2(0.66, 0.3);
  kl = mix(kl, PAPIER, WAAS * exp(-dot(w, w)));
  // Fijne ruis tegen strepen in de zachte overgangen
  float ruis = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor = vec4(kl + (ruis - 0.5) / 255.0, 1.0);
}
`;

  var STANDAARD = {
    STAPPEN: 90, STAP: '1.0', START: '0.05', VER: '40.0',
    SCHADUW_STAPPEN: 22, SCHADUW_K: '9.0', SCHADUW_VER: '6.0', SCHADUW_START: '0.02', SCHADUW_AF: '0.006',
    AO_BEREIK: '0.35', AO_STERK: '1.8',
    KEY: '0.3', AMB: '0.8', HEMEL_MIN: '0.88', NEVEL: '0.0', WAAS: '0.0',
    HEMEL: 'normalize(vec3(0.0, 1.0, 0.25))',
    PAPIER: 'vec3(0.961, 0.969, 0.965)'
  };

  g.TCKern = {
    bouw: function (scene) {
      var defs = Object.assign({}, STANDAARD, scene.def || {});
      var kop = Object.keys(defs).map(function (k) { return '#define ' + k + ' ' + defs[k]; }).join('\n');
      var gob = /float\s+gobo\s*\(/.test(scene.glsl) ? '' : 'float gobo(vec3 p) { return 1.0; }\n';
      var glo = /vec3\s+gloed\s*\(/.test(scene.glsl) ? '' : 'vec3 gloed(vec3 p, vec3 n) { return vec3(0.0); }\n';
      var kle = /vec3\s+kleur\s*\(/.test(scene.glsl) ? '' : 'vec3 kleur(vec3 p, vec3 n) { return vec3(0.9, 0.91, 0.905); }\n';
      var ach = /vec3\s+achter\s*\(/.test(scene.glsl) ? '' : 'vec3 achter(vec2 uv) { return pow(PAPIER, vec3(2.2)); }\n';
      return kop + '\n' + BOVEN + scene.glsl + '\n' + gob + glo + kle + ach + ONDER;
    },

    // Deeltjes: echte punten op een bewegend oppervlak, boven op de achtergrond. De vorm komt uit opp(q) van de
    // scène. Waar het oppervlak van het licht wegdraait, worden de stipjes groter, zoals bij een drukraster
    bouwDeeltjes: function (scene) {
      var d = scene.deeltjes;
      var vs = `
precision highp float;
attribute vec2 a;
uniform vec2 uRes;
uniform float uT;
uniform float uIn;
uniform vec2 uM;
uniform vec3 uRo;
uniform vec3 uTa;
uniform vec3 uL;
uniform float uLens;
uniform float uK;
varying vec3 vK;
varying float vA;
mat2 rot(float h) { float c = cos(h), s = sin(h); return mat2(c, -s, s, c); }
` + d.gobo + d.glsl + `
void main() {
  vec2 q = a * BREED;
  vec3 P = opp(q);
  vec3 n = normalize(cross(opp(q + vec2(0.05, 0.0)) - P, opp(q + vec2(0.0, 0.05)) - P));
  if (n.z < 0.0) n = -n;
  float nl = clamp(dot(n, uL) / uL.z, 0.0, 1.0);

  vec3 f = normalize(uTa - uRo);
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, f);
  vec3 d = P - uRo;
  float z = dot(d, f);
  vec2 uv = vec2(dot(d, r), dot(d, u)) * uLens / z;
  gl_Position = vec4(uv.x * 2.0 * uRes.y / uRes.x, uv.y * 2.0, 0.0, 1.0);

  float diepte = uRo.z / z;
  float donker = pow(1.0 - nl, 1.3);
  gl_PointSize = max(1.0, (STIP_MIN + STIP_BEREIK * donker) * diepte * uK);

  // De tekst en de bovenkant blijven vrij, en de vorm vaagt zelf weg aan haar randen
  vec2 w = (uv - vec2(0.0, 0.08)) / vec2(0.92, 0.4);
  float vrij = 1.0 - exp(-pow(dot(w, w), 1.6));
  vrij *= 1.0 - 0.9 * smoothstep(-0.02, 0.3, uv.y);
  float rand = (1.0 - smoothstep(0.82, 1.0, abs(a.x))) * (1.0 - smoothstep(0.82, 1.0, abs(a.y)));
  vA = STIP_DEKKING * vrij * rand * uIn * mix(0.3 + 0.7 * donker, 1.0, 0.25) * mix(1.0, 0.55, gobo(P));
  vK = mix(STIP_KLEUR, STIP_ACCENT, 1.0 - smoothstep(-1.6, -0.1, P.z));
}`;
      var fs = `
precision mediump float;
varying vec3 vK;
varying float vA;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  gl_FragColor = vec4(vK, vA * (1.0 - smoothstep(0.32, 0.5, r)));
}`;
      var defs = Object.keys(d.def).map(function (k) { return '#define ' + k + ' ' + d.def[k]; }).join('\n') + '\n';
      return { vs: defs + vs, fs: fs, nx: d.nx, ny: d.ny };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
