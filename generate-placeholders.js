/* Generates premium abstract 16:9 placeholder SVGs (Atelier Noir palette)
   for the rotating galleries. Run once: node generate-placeholders.js
   Safe to delete after — outputs land in public/images/. */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "public", "images");

// each config: two accent hues + a label hint baked subtly into composition
const SETS = {
  equipo: [
    { a: "#FF5C35", b: "#7A2E16" },
    { a: "#E8943A", b: "#5C3410" },
    { a: "#D2693E", b: "#3A1E12" },
    { a: "#C2451F", b: "#6E2814" },
    { a: "#E0A24B", b: "#4A2E0E" },
    { a: "#E04B2F", b: "#2A1410" },
  ],
  creativo: [
    { a: "#FF5C35", b: "#6E2A7A" },
    { a: "#2FB6A8", b: "#1E3A38" },
    { a: "#C2407A", b: "#3A1226" },
    { a: "#6E6BD6", b: "#201E4A" },
    { a: "#E8943A", b: "#5B2E7A" },
    { a: "#3AA0E0", b: "#12283A" },
  ],
};

function rand(seed) { // deterministic-ish per call
  let x = Math.sin(seed * 999) * 10000; return x - Math.floor(x);
}

function blob(cx, cy, r, color, op) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${op}"/>`;
}

function svg(cfg, seed) {
  const W = 1600, H = 900;
  const blobs = [];
  for (let i = 0; i < 5; i++) {
    const cx = Math.round(rand(seed + i) * W);
    const cy = Math.round(rand(seed + i + 11) * H);
    const r = Math.round(260 + rand(seed + i + 23) * 380);
    const color = i % 2 === 0 ? cfg.a : cfg.b;
    blobs.push(blob(cx, cy, r, color, (0.30 + rand(seed + i + 7) * 0.30).toFixed(2)));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<filter id="b${seed}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="120"/></filter>
<filter id="g${seed}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer></filter>
<radialGradient id="v${seed}" cx="50%" cy="42%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0C0B0A"/>
<g filter="url(#b${seed})">${blobs.join("")}</g>
<rect width="${W}" height="${H}" fill="url(#v${seed})"/>
<rect width="${W}" height="${H}" filter="url(#g${seed})" opacity="0.5"/>
</svg>`;
}

let n = 0;
for (const [name, cfgs] of Object.entries(SETS)) {
  cfgs.forEach((cfg, i) => {
    const file = path.join(OUT, `ph-${name}-${i + 1}.svg`);
    fs.writeFileSync(file, svg(cfg, (name === "equipo" ? 0 : 100) + i + 1));
    n++;
  });
}
console.log("Generated " + n + " placeholder SVGs in public/images/");
