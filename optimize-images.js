const sharp = require('sharp');
const fs = require('fs');

// Resize using in-memory buffer to allow source == dest paths
async function convert({ src, out, width, quality }) {
  const buf = await sharp(fs.readFileSync(src))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  fs.writeFileSync(out, buf);
  const kb = (buf.length / 1024).toFixed(1);
  const prev = (fs.statSync(src).size / 1024).toFixed(1);
  console.log(`${out}: ${kb}KB (src was ${prev}KB)`);
}

const tasks = [
  // Tighter compression on hero-960 (was q72 → q60 saves ~35KB)
  { src: 'assets/hero.webp',         out: 'assets/hero-960.webp',              width: 960,  quality: 60 },

  // Intermediate sizes so 2x-DPR mobile/tablet avoids downloading 1400w
  { src: 'assets/mission.webp',      out: 'assets/mission-1200.webp',          width: 1200, quality: 78 },
  { src: 'assets/case_study_1.jpg',  out: 'assets/case_study_1-1200.webp',     width: 1200, quality: 78 },

  // Logos: convert PNG→WebP and resize to 2× max display size
  { src: 'assets/innov-uk-logo.png', out: 'assets/innov-uk-logo.webp',         width: 220,  quality: 80 },
  { src: 'assets/nhs.png',           out: 'assets/nhs.webp',                   width: 290,  quality: 80 },

  // Resize oversized logos (use existing webp as source via buffer)
  { src: 'assets/dft-logo.webp',     out: 'assets/dft-logo.webp',              width: 210,  quality: 80 },
  { src: 'assets/anteam_logo.png',   out: 'assets/anteam_logo.webp',           width: 130,  quality: 85 },
];

Promise.all(tasks.map(convert)).catch(console.error);
