// De shader van de hero op de homepage: de muur met raamlicht (scène 3 uit Herontwerp officieel/hero-3d) en
// daarvoor een vloer, zodat er diepte in zit. Het raamlicht valt over de muur en loopt door op de vloer; de vloer
// lost naar voren op in het papier (en onderaan in de vervaging van de hero, zie hero-scene.css).
// Vroeger stond hier een staaf van draaiende schijven (scène 12); die is weg op vraag van Lucas (17/11).
// Testbeeld met dezelfde wiskunde: Herontwerp officieel/hero-3d/vloer-render.cjs
export const FRAGMENT = `
#define PAPIER vec3(0.961, 0.969, 0.965)
#define VLOER (-0.95)      // hoogte van de vloer; hoger = meer vloer in beeld
#define MUUR (-1.2)        // diepte van de muur
#define VLOER_AF 3.0       // vanaf hier lost de vloer naar voren op ...
#define VLOER_WEG 10.0     // ... en hier is ze helemaal opgelost

precision highp float;
uniform vec2 uRes;
uniform float uT;      // seconden sinds de start: het raamlicht schuift heel traag
uniform vec2 uM;       // muis, -1 tot 1 (y omhoog): de camera beweegt een fractie mee

const vec3 L3 = vec3(-0.55, 0.6, 0.58) / 0.99944985;

// Het licht door een raam met stijlen en dwarsregels, geprojecteerd op een punt van de muur of de vloer
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

vec3 scene(vec2 uv) {
  vec3 ro = vec3(uM.x * 0.35, 0.35 + uM.y * 0.15, 14.0);
  vec3 f = normalize(vec3(0.0, 0.2, 0.0) - ro);
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, f);
  vec3 rd = normalize(uv.x * r + uv.y * u + 2.3 * f);

  float tMuur = (MUUR - ro.z) / rd.z;
  float tVloer = rd.y < 0.0 ? (VLOER - ro.y) / rd.y : 1.0e9;

  if (tVloer < tMuur) {
    // De vloer: hetzelfde raamlicht, iets minder hemellicht dan de muur, en een zachte schaduw waar ze de
    // muur raakt. Naar voren lost ze op in het papier
    vec3 p = ro + rd * tVloer;
    float ao = 1.0 - 0.22 * exp(-(p.z - MUUR) * 1.4);
    vec3 lin = vec3(1.0, 0.985, 0.96) * 0.36 * L3.y * goboRaam(p)
             + vec3(0.965, 0.985, 1.0) * 0.86 * (0.97 + 0.03 * 0.75) * ao;
    vec3 kl = vec3(0.915) * lin;
    return mix(kl, pow(PAPIER, vec3(2.2)), smoothstep(VLOER_AF, VLOER_WEG, p.z));
  }

  // De muur, met onderaan een zachte schaduw waar ze de vloer raakt
  vec3 p = ro + rd * tMuur;
  float ao = 1.0 - 0.12 * exp(-(p.y - VLOER) * 2.2);
  float hemel = 0.5 + 0.5 * 0.85;
  vec3 lin = vec3(1.0, 0.985, 0.96) * 0.36 * L3.z * goboRaam(p)
           + vec3(0.965, 0.985, 1.0) * 0.86 * mix(0.97, 1.0, hemel) * ao
           + vec3(0.98, 1.0, 0.97) * 0.08 * clamp(0.5 - 0.5 * L3.z, 0.0, 1.0);
  return vec3(0.9, 0.91, 0.905) * lin;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 kl = pow(clamp(scene(uv), 0.0, 1.0), vec3(1.0 / 2.2));
  // Fijne ruis tegen strepen in de zachte overgangen
  float ruis = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor = vec4(kl + (ruis - 0.5) / 255.0, 1.0);
}
`;
