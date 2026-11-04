// De scènes. Elke scène: een vorm (map), een camera, een licht en wat instellingen.
// ro = positie van de camera, ta = waar ze naar kijkt, lens = hoger is meer ingezoomd.
// muis = hoe ver de camera meebeweegt, beweegt = of de scène ook zonder muis traag verder leeft.
(function (g) {
  // Het raamlicht van scène 3, ook gebruikt door de deeltjesgolf
  var RAAMLICHT = `
float gobo(vec3 p) {
  float t = (6.0 - p.z) / uL.z;
  vec2 q = (p + uL * t).xy;
  float u = q.x + q.y * 0.85 + uT * 0.014;
  float v = q.y - q.x * 0.1;
  float w = 0.05 + 0.006 * t;
  float paan = smoothstep(-w, w, 0.92 - abs(mod(u, 2.6) - 1.3));
  float raam = (1.0 - smoothstep(-w * 2.0, w * 2.0, abs(u - 2.2) - 3.4));
  float dwars = smoothstep(-w, w, abs(mod(v, 3.2) - 1.6) - 0.05);
  return paan * raam * dwars;
}
`;

  g.TCScenes = [

    {
      id: 'blokkenwand', naam: 'Blokkenwand',
      uitleg: 'Een wand van verspringende, schuin afgewerkte blokken. Eén materiaal, enkel licht en schaduw.',
      ro: [0.5, 0.4, 12], ta: [0, 0, 0], lens: 2.1, licht: [-0.42, 0.72, 0.55], muis: [0.5, 0.35], beweegt: false,
      def: { STAP: '0.85', STAPPEN: 110, KEY: '0.34', AMB: '0.78', AO_BEREIK: '0.34', AO_STERK: '1.5', SCHADUW_K: '7.0', WAAS: '0.55', HEMEL: 'normalize(vec3(-0.1, 0.5, 0.85))' },
      glsl: `
float map(vec3 p) {
  vec2 c = vec2(2.1, 1.5);
  float rij = floor(p.y / c.y);
  float xs = p.x + 0.5 * c.x * mod(rij, 2.0);
  float kol = floor(xs / c.x);
  vec2 l = vec2(xs - (kol + 0.5) * c.x, p.y - (rij + 0.5) * c.y);
  float ax = 0.62 * uIn, ay = 0.3 * uIn;
  vec3 m = normalize(vec3(-ax / c.x, -ay / c.y, 1.0));
  float vlak = dot(m, vec3(l, p.z - 0.5 * (ax + ay)));
  float blok = max(vlak, max(abs(l.x) - c.x * 0.5 + 0.004, abs(l.y) - c.y * 0.5 + 0.004));
  float grens = 0.03 + min(c.x * 0.5 - abs(l.x), c.y * 0.5 - abs(l.y));
  gE = min(blok, p.z + 0.02);
  return min(gE, max(grens, p.z - ax - ay - 0.02));
}`
    },

    {
      id: 'hexbol', naam: 'Hexbol',
      uitleg: 'Een grote bol van matte, zeshoekige platen die onderaan opkomt, met een zweem groen licht in de naden. De platen ademen traag.',
      ro: [0, 0.0, 13], ta: [0, 0, 0], lens: 2.0, licht: [-0.45, 0.78, 0.44], muis: [0.5, 0.25], beweegt: true,
      def: { STAP: '0.62', STAPPEN: 130, KEY: '0.4', AMB: '0.7', AO_BEREIK: '0.26', AO_STERK: '2.3', SCHADUW_K: '9.0', SCHADUW_START: '0.08', SCHADUW_AF: '0.02', HEMEL: 'normalize(vec3(0.0, 0.8, 0.6))' },
      glsl: `
const vec3 MID = vec3(0.0, -9.2, 0.6);
const float R = 8.0;
const float SCHAAL = 16.0;
float hexd(vec2 p) { p = abs(p); return max(dot(p, vec2(0.5, 0.8660254)), p.x); }
vec4 hexcel(vec2 uv) {
  vec2 r = vec2(1.0, 1.7320508), h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  vec2 id = uv - gv;
  return vec4(gv, floor(id.x * 2.0 + 0.5), floor(id.y / 0.8660254 + 0.5));
}
float map(vec3 p) {
  vec3 q = p - MID;
  q.yz *= rot(-0.32);
  q.xz *= rot(uT * 0.008);
  float l = length(q);
  vec3 d = q / l;
  vec2 uv = d.xz / (1.0 + d.y) * SCHAAL;
  vec4 c = hexcel(uv);
  float hd = hexd(c.xy);
  float n = h21(c.zw);
  float uit = (0.045 * sin(uT * 0.35 + n * 6.283) + 0.1 * n) * uIn - (1.0 - uIn) * 0.4 * (0.4 + n);
  float lat = (hd - 0.46) * (1.0 + d.y) / SCHAAL * l;
  float rad = abs(l - (R + uit)) - 0.14;
  vec2 w = vec2(lat, rad) + 0.05;
  float plaat = min(max(w.x, w.y), 0.0) + length(max(w, vec2(0.0))) - 0.05;
  return min(plaat, l - (R - 0.2));
}
vec3 kleur(vec3 p, vec3 n) {
  return length(p - MID) < R - 0.12 ? vec3(0.5, 0.58, 0.52) : vec3(0.94, 0.95, 0.945);
}
vec3 gloed(vec3 p, vec3 n) {
  return length(p - MID) < R - 0.12 ? vec3(0.2, 0.42, 0.24) * 0.9 : vec3(0.0);
}`
    },

    {
      id: 'raamlicht', naam: 'Raamlicht',
      uitleg: 'Een stille witte ruimte met twee sokkels. De ochtendzon valt schuin door een raam en schuift heel traag over de muur.',
      ro: [0, 0.35, 14], ta: [0, 0.2, 0], lens: 2.3, licht: [-0.55, 0.6, 0.58], muis: [0.35, 0.15], beweegt: true,
      def: { KEY: '0.36', AMB: '0.86', HEMEL_MIN: '0.97', AO_BEREIK: '0.8', AO_STERK: '0.55', SCHADUW_K: '14.0', SCHADUW_VER: '9.0', HEMEL: 'normalize(vec3(0.0, 0.5, 0.85))' },
      glsl: `
float map(vec3 p) {
  float muur = p.z + 1.2;
  float vloer = p.y + 2.2;
  float groot = kbox(p - vec3(3.0, -2.2, 0.8), vec3(1.6, 0.92, 1.4), 0.015);
  float laag = kbox(p - vec3(-2.6, -2.2, 0.8), vec3(2.2, 0.36, 1.4), 0.015);
  return min(min(muur, vloer), min(groot, laag));
}` + RAAMLICHT
    },

    {
      id: 'lamellen', naam: 'Lamellen',
      uitleg: 'Een gevel van fijne verticale vinnen, die samen een zachte golf vormen. De golf rolt traag en buigt mee met de muis.',
      ro: [1.0, 0.2, 12], ta: [0, 0, 0], lens: 2.15, licht: [-0.8, 0.35, 0.48], muis: [0.9, 0.25], beweegt: true,
      def: { STAP: '0.75', STAPPEN: 110, KEY: '0.34', AMB: '0.78', AO_BEREIK: '0.24', AO_STERK: '0.9', SCHADUW_K: '7.0', SCHADUW_STAPPEN: 16, WAAS: '0.8', HEMEL: 'normalize(vec3(-0.2, 0.2, 0.95))' },
      glsl: `
float golf(float x, float y) {
  return 0.55 * sin(x * 0.62 + y * 0.42 - uT * 0.1) + 0.28 * sin(x * 1.25 - y * 0.55 + 1.3 + uT * 0.07);
}
float vin(vec3 p, float id, float s) {
  float x = p.x - (id + 0.5) * s;
  float boven = golf((id + 0.5) * s, p.y) * uIn - (1.0 - uIn) * 1.2;
  vec2 w = vec2(abs(x) - 0.05, p.z - boven);
  return min(max(w.x, w.y * 0.75), 0.0) + length(max(w, vec2(0.0)));
}
float map(vec3 p) {
  float s = 0.2;
  float id = floor(p.x / s);
  float d = min(vin(p, id, s), min(vin(p, id - 1.0, s), vin(p, id + 1.0, s)));
  return min(d, p.z + 1.3);
}
vec3 kleur(vec3 p, vec3 n) { return p.z < -1.25 ? vec3(0.72, 0.76, 0.73) : vec3(0.94, 0.95, 0.945); }`
    },

    {
      id: 'trap', naam: 'Brede trap',
      uitleg: 'Een brede witte trap die oploopt naar het licht, recht onder de titel. Vooruitgang als architectuur, met schuin zonlicht.',
      ro: [0, 3.6, 12], ta: [0, 3.1, 0], lens: 1.45, licht: [-0.42, 0.82, 0.38], muis: [0.5, 0.15], beweegt: false,
      def: { VER: '60.0', KEY: '0.3', AMB: '0.82', AO_BEREIK: '0.22', AO_STERK: '1.9', SCHADUW_K: '20.0', SCHADUW_VER: '8.0', HEMEL: 'normalize(vec3(0.0, 0.7, 0.7))', HEMEL_MIN: '0.82', WAAS: '0.5' },
      glsl: `
const float LOOP = 0.95;
const float HOOG = 0.26;
const float BEGIN = 9.0;
float trede(vec2 q, float k) {
  return max(q.y - (k + 1.0) * HOOG * uIn, k * LOOP - q.x);
}
float map(vec3 p) {
  vec2 q = vec2(BEGIN - p.z, p.y + 0.8);
  float k = clamp(floor(q.x / LOOP), 0.0, 11.0);
  float d = min(trede(q, k), min(trede(q, k - 1.0), trede(q, k + 1.0)));
  return min(min(d, q.y), p.z + 4.2) * 0.95;
}
vec3 kleur(vec3 p, vec3 n) { return vec3(0.94, 0.95, 0.945); }
float gobo(vec3 p) {
  float u = p.x + p.z * 0.55 + 3.0;
  float w = 0.08;
  return 0.25 + 0.75 * smoothstep(-w, w, u + 1.0);
}`
    },

    {
      id: 'pinnen', naam: 'Pinnenveld',
      uitleg: 'Een veld van vierkante zuiltjes op verschillende hoogtes, dat in de verte in het papier verdwijnt. Waar de muis komt, duiken ze zacht weg.',
      ro: [0.31, 3.9, 12], ta: [0.31, 2.3, 0], lens: 1.9, licht: [-0.55, 0.74, 0.38], muis: [0.5, 0.15], beweegt: true,
      def: { STAP: '0.8', STAPPEN: 120, VER: '70.0', KEY: '0.34', AMB: '0.76', NEVEL: '0.0034', AO_BEREIK: '0.4', AO_STERK: '0.8', SCHADUW_K: '10.0', SCHADUW_STAPPEN: 26 },
      glsl: `
float hoogte(vec2 id, vec2 q) {
  float g = 0.55 * sin(id.x * 0.22 + id.y * 0.17 + uT * 0.12) + 0.4 * sin(id.x * 0.09 - id.y * 0.31 - uT * 0.09) + 0.1 * h21(id);
  vec2 m = q - vec2(uM.x * 7.0, 5.0 - uM.y * 6.0);
  float dip = 1.0 - 0.75 * exp(-dot(m, m) * 0.14) * smoothstep(0.0, 0.06, abs(uM.x) + abs(uM.y));
  return (0.72 + 0.46 * g) * dip * uIn;
}
float map(vec3 p) {
  float s = 0.62;
  vec2 id = floor(p.xz / s);
  vec2 l = mod(p.xz, s) - s * 0.5;
  float h = max(hoogte(id, (id + 0.5) * s), 0.02);
  float z = kbox(vec3(l.x, p.y - h * 0.5 + 0.1, l.y), vec3(0.292, h * 0.5 + 0.1, 0.292), 0.06);
  float grens = 0.05 + min(s * 0.5 - abs(l.x), s * 0.5 - abs(l.y));
  gE = min(z, p.y + 0.02);
  return min(gE, max(grens, p.y - 1.2));
}
vec3 kleur(vec3 p, vec3 n) { return vec3(0.94, 0.95, 0.945); }`
    },

    {
      id: 'vouw', naam: 'Gevouwen vlak',
      uitleg: 'Een groot wit vlak met een paar scherpe vouwen, als een architectuurmaquette. Heel weinig: enkel licht en schaduw waar de vouwen liggen.',
      ro: [0, 0, 11], ta: [0, 0, 0], lens: 2.1, licht: [-0.34, 0.42, 0.84], muis: [0.5, 0.35], beweegt: false,
      def: { STAP: '0.8', KEY: '0.62', AMB: '0.5', HEMEL_MIN: '0.86', AO_BEREIK: '0.4', AO_STERK: '0.8', SCHADUW_K: '10.0', WAAS: '0.35', HEMEL: 'normalize(vec3(-0.1, 0.35, 1.0))' },
      glsl: `
float vouw(vec2 p, vec2 n, float c, float a) { return a * abs(dot(p, normalize(n)) + c); }
float map(vec3 p) {
  vec2 q = p.xy;
  float h = 0.0;
  h += vouw(q, vec2(1.0, 0.55), 0.3, 0.2);
  h += vouw(q, vec2(-0.7, 1.0), -1.1, 0.17);
  h += vouw(q, vec2(0.25, 1.0), 1.5, 0.13);
  h += vouw(q, vec2(1.0, -0.2), -3.1, 0.2);
  h += vouw(q, vec2(1.0, 0.9), 3.4, 0.12);
  return (p.z + 1.1 - (h - 1.1) * uIn) * 0.8;
}`
    },

    {
      id: 'terrassen', naam: 'Terrassen',
      uitleg: 'Ronde terrassen die trapsgewijs afdalen naar het midden, als een zen-tuin of een amfitheater, onder scherp strijklicht.',
      ro: [0, 8.5, 8.2], ta: [0, 0, -0.2], lens: 2.0, licht: [-0.68, 0.56, -0.48], muis: [0.7, 0.3], beweegt: false,
      def: { STAP: '0.62', STAPPEN: 110, KEY: '0.3', AMB: '0.82', AO_BEREIK: '0.16', AO_STERK: '1.8', SCHADUW_K: '8.0', WAAS: '0.5', HEMEL: 'vec3(0.0, 1.0, 0.0)' },
      glsl: `
float map(vec3 p) {
  float r = length(p.xz);
  float b = 1.05;
  float k = floor(r / b);
  float f = fract(r / b);
  float tred = smoothstep(0.93, 1.0, f);
  float h = (k + tred) * 0.2 * uIn;
  return (p.y - h) * 0.6;
}`
    },

    {
      id: 'bogen', naam: 'Bogengang',
      uitleg: 'Een rij witte bogen die in de verte oplost in het licht, precies achter de titel. Zonlicht valt schuin tussen de portalen door.',
      ro: [0, -0.2, 14], ta: [0, 0.35, 0], lens: 1.5, licht: [-0.72, 0.56, 0.42], muis: [0.6, 0.2], beweegt: false,
      def: { VER: '70.0', STAPPEN: 110, KEY: '0.34', AMB: '0.76', NEVEL: '0.0022', AO_BEREIK: '0.3', AO_STERK: '1.0', SCHADUW_K: '14.0', SCHADUW_VER: '12.0', SCHADUW_STAPPEN: 28, WAAS: '0.45' },
      glsl: `
float boog(vec2 p, float a, float s) {
  if (p.y > s) return length(vec2(p.x, p.y - s)) - a;
  return abs(p.x) - a;
}
float map(vec3 p) {
  float rep = 3.0;
  float z = mod(p.z + 60.0, rep) - rep * 0.5;
  vec2 q = p.xy + vec2(0.0, 2.3);
  float bin = boog(q, 3.2, 2.5);
  float buit = boog(q, 4.2, 2.5);
  float portaal = max(max(abs(z) - 0.3 * uIn, -bin), buit);
  return min(portaal, p.y + 2.3);
}
vec3 kleur(vec3 p, vec3 n) { return vec3(0.94, 0.95, 0.945); }`
    },

    {
      id: 'schijven', naam: 'Draaiende schijven',
      uitleg: 'Eén sculptuur: een lange staaf van dunne vierkante schijven die elk een fractie verder draaien, onder de tekst. Bij het laden draait de staaf in, daarna volgt ze traag de muis.',
      ro: [0, 0, 14], ta: [0, 0, 0], lens: 2.05, licht: [0.62, 0.66, 0.42], muis: [0.5, 0.2], beweegt: true,
      def: { STAP: '0.8', STAPPEN: 110, VER: '50.0', NEVEL: '0.0016', KEY: '0.36', AMB: '0.8', HEMEL_MIN: '0.86', AO_BEREIK: '0.34', AO_STERK: '1.2', SCHADUW_K: '7.0', SCHADUW_STAPPEN: 30, SCHADUW_VER: '8.0', HEMEL: 'normalize(vec3(0.0, 0.5, 0.86))' },
      glsl: `
const vec2 AS = vec2(-2.12, 0.0);
float map(vec3 p) {
  float wand = p.z + 16.0;
  p.xz *= rot(-0.62);
  p.xy *= rot(-0.05);
  float s = 0.44;
  float id = floor(p.x / s);
  float lx = mod(p.x, s) - s * 0.5;
  float a = ((id + 0.5) * s * 0.3 + uM.x * 0.45 + uT * 0.035) * uIn + 0.4;
  vec2 yz = p.yz - AS;
  vec2 q = rot(a) * yz;
  float schijf = kbox(vec3(lx, q), vec3(0.06, 0.8, 0.8), 0.035);
  float grens = 0.07 + s * 0.5 - abs(lx);
  gE = min(schijf, wand);
  return min(gE, max(grens, length(yz) - 1.25));
}
vec3 kleur(vec3 p, vec3 n) { return vec3(0.94, 0.95, 0.945); }`
    },

    {
      id: 'deeltjes', naam: 'Deeltjesgolf',
      uitleg: 'Duizenden fijne stipjes op een golvend oppervlak dat rechtsonder in een kolk plooit, tegen de muur met het raamlicht van scène 3. De golven bewegen traag en buigen mee met de muis.',
      ro: [0, 0.35, 14], ta: [0, 0.2, 0], lens: 2.3, licht: [-0.55, 0.6, 0.58], muis: [0.35, 0.15], beweegt: true,
      def: { KEY: '0.36', AMB: '0.86', HEMEL_MIN: '0.97', AO_BEREIK: '0.8', AO_STERK: '0.55', SCHADUW_K: '14.0', SCHADUW_STAPPEN: 2, HEMEL: 'normalize(vec3(0.0, 0.5, 0.85))' },
      glsl: `
float map(vec3 p) { return p.z + 1.2; }` + RAAMLICHT,
      deeltjes: {
        nx: 640, ny: 380, gobo: RAAMLICHT,
        def: { BREED: 'vec2(11.5, 6.6)', STIP_MIN: '1.25', STIP_BEREIK: '2.2', STIP_DEKKING: '0.78', STIP_KLEUR: 'vec3(0.2, 0.29, 0.38)', STIP_ACCENT: 'vec3(0.33, 0.52, 0.38)' },
        glsl: `
vec3 opp(vec2 q) {
  float t = uT;
  vec2 c = vec2(4.0 + 0.2 * sin(t * 0.07), -1.5);
  vec2 d = q - c;
  float r2 = dot(d, d);
  vec2 w = c + rot(2.1 * exp(-r2 / 5.0) * uIn) * d;
  float z = 0.42 * sin(w.x * 0.85 + w.y * 0.5 + t * 0.32)
          + 0.24 * sin(w.x * 1.7 - w.y * 0.9 - t * 0.24)
          + 0.13 * sin(w.x * 3.1 + w.y * 2.2 + t * 0.4);
  z = z * uIn - 1.9 * exp(-r2 / 3.2) * uIn;
  w.x += 0.35 * sin(w.y * 1.3 + t * 0.2) * uIn;
  w.y += 0.3 * sin(w.x * 1.05 - t * 0.16) * uIn;
  vec2 m = w - uM * vec2(5.4, 3.0);
  z += 0.55 * exp(-dot(m, m) * 0.5) * smoothstep(0.0, 0.06, abs(uM.x) + abs(uM.y));
  return vec3(w, z);
}`
      }
    },

    {
      // Twee aparte lagen. De sculptuur rekent exact als scène 10, met haar camera en haar licht.
      // Elke pixel eromheen rekent exact als de muur van scène 3, met de camera en het licht van scène 3.
      id: 'schijven-raam', naam: 'Schijven in raamlicht',
      uitleg: 'De vorm en de intro van scène 10 voor het raamlicht van scène 3. De staaf draait niet meer: de schijven onder de muis schuiven zacht uit de rij en glijden daarna terug.',
      ro: [0, 0, 14], ta: [0, 0, 0], lens: 2.05, licht: [0.62, 0.66, 0.42], muis: [0.15, 0.06], beweegt: true,
      // Welke schijf ligt onder de muis? Zelfde vorm en draaiing als map() hieronder.
      // Geeft het nummer van de schijf terug, of null als de muis naast de staaf staat
      kaarten: {
        aantal: 64,
        raak: function (o, d) {
          function draai(v) {
            var c = Math.cos(-0.62), s = Math.sin(-0.62);
            var x = v[0] * c - v[2] * s, z = v[0] * s + v[2] * c;
            var c2 = Math.cos(-0.05), s2 = Math.sin(-0.05);
            return [x * c2 - v[1] * s2, x * s2 + v[1] * c2, z];
          }
          var a = draai(o), b = draai(d);
          var oy = a[1] + 2.12, oz = a[2];
          var A = b[1] * b[1] + b[2] * b[2];
          var B = oy * b[1] + oz * b[2];
          var C = oy * oy + oz * oz - 1.05 * 1.05;
          var D = B * B - A * C;
          if (D < 0) return null;
          var t = (-B - Math.sqrt(D)) / A;
          return Math.floor((a[0] + t * b[0]) / 0.44);
        }
      },
      def: { STAP: '0.8', STAPPEN: 110, VER: '50.0', NEVEL: '0.0016', KEY: '0.36', AMB: '0.8', HEMEL_MIN: '0.86', AO_BEREIK: '0.34', AO_STERK: '1.2', SCHADUW_K: '7.0', SCHADUW_STAPPEN: 30, SCHADUW_VER: '8.0', HEMEL: 'normalize(vec3(0.0, 0.5, 0.86))' },
      glsl: `
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
` + RAAMLICHT.replace('float gobo', 'float goboRaam').replace(/uL/g, 'L3') + `
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
}`
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
