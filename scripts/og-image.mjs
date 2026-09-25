// Builds the link-preview image (Open Graph, 1200×630) from the hero photo:
// a dark-green text panel on the left and the photo on the right.
// Run after changing the hero photo:  node scripts/og-image.mjs
// Output: public/images/og.jpg (committed; used by src/lib/seo.ts).
// `sharp` comes with Next.js, so no extra dependency is needed.

import sharp from 'sharp';

const W = 1200;
const H = 630;
const PANEL = 620;

// Scale to the image height, then crop a window with both the vet and the cat.
const CROP_LEFT = 0.3; // share of the scaled width skipped on the left
const scaled = await sharp('public/images/hero.jpg').resize({ height: H }).toBuffer({ resolveWithObject: true });
const left = Math.min(Math.round(scaled.info.width * CROP_LEFT), scaled.info.width - (W - PANEL));
const photo = await sharp(scaled.data).extract({ left, top: 0, width: W - PANEL, height: H }).toBuffer();

// Latin-only caption: the localized title and description travel in og:title /
// og:description next to the image.
const text = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${PANEL}" height="${H}" fill="#1f3a26"/>
  <rect x="${PANEL - 6}" width="6" height="${H}" fill="#3f7d3d"/>
  <rect x="72" y="150" width="292" height="50" rx="25" fill="#e5eee0"/>
  <text x="218" y="184" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#2c6030">PORTFOLIO DEMO</text>
  <text x="68" y="318" font-family="Segoe UI, Arial, sans-serif" font-size="104" font-weight="800" fill="#ffffff">VetClinic</text>
  <text x="72" y="384" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#e5eee0">Site · Pet account · Admin panel</text>
  <text x="72" y="458" font-family="Segoe UI, Arial, sans-serif" font-size="28" letter-spacing="5" fill="#b9cdb3">RO · UA · EN · PL</text>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: '#1f3a26' } })
  .composite([
    { input: photo, left: PANEL, top: 0 },
    { input: Buffer.from(text), left: 0, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/images/og.jpg');

console.log('public/images/og.jpg');
