// De shader van de hero: een staaf van draaiende schijven (scène 10) voor de muur met raamlicht (scène 3).
// Rechtstreeks overgenomen uit de testversie in Herontwerp officieel/hero-3d (scène 12).
export const FRAGMENT = `#define STAPPEN 110
#define STAP 0.8
#define START 0.05
#define VER 50.0
#define SCHADUW_STAPPEN 30
#define SCHADUW_K 7.0
#define SCHADUW_VER 8.0
#define SCHADUW_START 0.02
#define SCHADUW_AF 0.006
#define AO_BEREIK 0.34
#define AO_STERK 1.2
#define KEY 0.36
#define AMB 0.8
#define HEMEL_MIN 0.86
#define NEVEL 0.0016
#define WAAS 0.0
#define HEMEL normalize(vec3(0.0, 0.5, 0.86))
#define PAPIER vec3(0.961, 0.969, 0.965)

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

const vec2 AS = vec2(-2.12, 0.0);
uniform sampler2D uKaart;   // per schijf hoe ver ze uit de rij staat, van 0 tot 1
float map(vec3 p) {
  p.xz *= rot(-0.62);
  p.xy *= rot(-0.05);
  float s = 0.44;
  float id = floor(p.x / s);
  float lx = mod(p.x, s) - s * 0.5;
  float op = texture2D(uKaart, vec2((id + 32.5) / 64.0, 0.5)).r;
  float a = ((id + 0.5) * s * 0.3 + 0.37) * uIn + 0.4 + 0.22 * op;
  vec2 buis = p.yz - AS;
  vec2 yz = buis - vec2(0.42, 0.32) * op;
  vec2 q = rot(a) * yz;
  float schijf = kbox(vec3(lx, q), vec3(0.06, 0.8, 0.8), 0.035);
  float grens = 0.07 + s * 0.5 - abs(lx);
  gE = schijf;
  return min(gE, max(grens, length(buis) - 1.95));
}
vec3 kleur(vec3 p, vec3 n) { return vec3(0.94, 0.95, 0.945); }
const vec3 L3 = vec3(-0.55, 0.6, 0.58) / 0.99944985;

float goboRaam(vec3 p) {
  float t = (6.0 - p.z) / L3.z;
  vec2 q = (p + L3 * t).xy;
  float u = q.x + q.y * 0.85 + uT * 0.014;
  float v = q.y - q.x * 0.1;
  float w = 0.05 + 0.006 * t;
  float paan = smoothstep(-w, w, 0.92 - abs(mod(u, 2.6) - 1.3));
  float raam = (1.0 - smoothstep(-w * 2.0, w * 2.0, abs(u - 2.2) - 3.4));
  float dwars = smoothstep(-w, w, abs(mod(v, 3.2) - 1.6) - 0.05);
  return paan * raam * dwars;
}

// De muur van scène 3: dezelfde camera, hetzelfde licht en dezelfde belichting
vec3 achter(vec2 uv) {
  vec3 ro = vec3(uM.x * 0.35, 0.35 + uM.y * 0.15, 14.0);
  vec3 f = normalize(vec3(0.0, 0.2, 0.0) - ro);
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, f);
  vec3 rd = normalize(uv.x * r + uv.y * u + 2.3 * f);
  vec3 p = ro + rd * (-1.2 - ro.z) / rd.z;
  vec3 n = vec3(0.0, 0.0, 1.0);
  float hemel = 0.5 + 0.5 * dot(n, normalize(vec3(0.0, 0.5, 0.85)));
  vec3 lin = vec3(1.0, 0.985, 0.96) * 0.36 * L3.z * goboRaam(p)
           + vec3(0.965, 0.985, 1.0) * 0.86 * mix(0.97, 1.0, hemel)
           + vec3(0.98, 1.0, 0.97) * 0.08 * clamp(0.5 - 0.5 * L3.z, 0.0, 1.0);
  return vec3(0.9, 0.91, 0.905) * lin;
}
float gobo(vec3 p) { return 1.0; }
vec3 gloed(vec3 p, vec3 n) { return vec3(0.0); }

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
