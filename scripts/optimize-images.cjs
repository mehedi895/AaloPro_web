#!/usr/bin/env node
// Optional artwork regeneration. The normal build copies the checked-in WebP
// variants and does not need Sharp. Install Sharp separately or provide its
// absolute module path through AALOPRO_SHARP_PATH, then run this script.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require(process.env.AALOPRO_SHARP_PATH || 'sharp');

const root = path.resolve(__dirname, '..');
const outputDirectory = path.join(root, 'assets', 'responsive');
const sources = [
  { name: 'aalopro-header', file: 'assets/brand/aalopro-header-transparent.png', widths: [320, 640, 960] },
  { name: 'aalopro-footer', file: 'assets/brand/aalopro-footer-yellow.png', widths: [320, 640, 960] },
  { name: 'aaloapp-logo', file: 'assets/brand/aaloapp-logo-transparent.png', widths: [320, 640] },
  { name: 'aalodot-logo', file: 'assets/brand/aalodot-logo-transparent.png', widths: [320, 640] },
  { name: 'aaloapp-phone', file: 'assets/generated/aaloapp-phone-transparent.png', widths: [240, 480, 720] },
  { name: 'aalodot', file: 'assets/generated/aalodot.webp', widths: [320, 640] },
  { name: 'aaloapp-overview', file: 'assets/products/aaloapp-overview.png', widths: [480, 800, 1254] },
  { name: 'aalodot-overview', file: 'assets/products/aalodot-overview.png', widths: [480, 800, 1254] }
];

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true });
  const variants = [];
  for (const source of sources) {
    const input = await fs.readFile(path.join(root, source.file));
    const original = await sharp(input).metadata();
    // Keep the full canvas, all existing labels and transparency. Only resize
    // and encode; never crop, stretch, flatten or upscale the supplied artwork.
    const widths = [...new Set(source.widths.map(width => Math.min(width, original.width)))];
    for (const width of widths) {
      const bytes = await sharp(input)
        .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
        .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true })
        .toBuffer();
      const metadata = await sharp(bytes).metadata();
      if (metadata.width !== width || (original.hasAlpha && !metadata.hasAlpha)) {
        throw new Error(`Unexpected dimensions or lost transparency: ${source.file} at ${width}px`);
      }
      const file = `assets/responsive/${source.name}-${width}.webp`;
      const destination = path.join(root, file);
      await fs.writeFile(destination + '.tmp', bytes);
      await fs.rename(destination + '.tmp', destination);
      variants.push({
        file,
        source: source.file,
        sourceBytes: input.length,
        width: metadata.width,
        height: metadata.height,
        hasAlpha: metadata.hasAlpha,
        bytes: bytes.length,
        sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
        processing: `Full-canvas resize to ${metadata.width}×${metadata.height}; WebP quality 90; original retained`
      });
    }
  }
  process.stdout.write(JSON.stringify({ sharp: sharp.versions.sharp, variants }, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
