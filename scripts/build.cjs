const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = [
  'index.html', 'aaloapp/index.html', 'aalodot/index.html', 'terms/index.html', 'privacy/index.html',
  'styles.css', 'product-pages.css', 'legal-pages.css', 'script.js', 'analytics.js', 'analytics-consent.css', 'robots.txt', 'sitemap.xml',
  'assets/bulb.svg', 'assets/favicon.svg', 'assets/flags/singapore.svg',
  'assets/brand/aalopro-gold.png', 'assets/brand/aalopro-header.png', 'assets/brand/aalodot-logo-transparent.png', 'assets/brand/aaloapp-logo-transparent.png',
  'assets/flags/bangladesh.png', 'assets/flags/pakistan.svg', 'assets/flags/indonesia.svg',
  'assets/flags/vietnam.webp', 'assets/flags/philippines.webp',
  'assets/fonts/nunito-sans.woff2', 'assets/fonts/kalam.woff2',
  'assets/fonts/NunitoSans-OFL.txt', 'assets/fonts/Kalam-OFL.txt',
  'assets/videos/aaloapp-preview.mp4', 'assets/videos/aaloapp-preview.webp',
  'assets/videos/aalodot-preview.mp4', 'assets/videos/aalodot-preview.webp',
  'assets/products/aalodot-overview.png', 'assets/products/aaloapp-overview.png',
  'assets/generated/hero.webp', 'assets/generated/impact.webp', 'assets/generated/aalodot.webp', 'assets/generated/aaloapp-phone-transparent.png',
  'assets/reference/rafi.webp', 'assets/reference/ayesha.webp', 'assets/reference/fatima.webp'
];
// Validate the inputs before replacing the generated directory.
for (const file of files) {
  if (!fs.statSync(path.join(root, file)).isFile()) throw new Error(`Missing source file: ${file}`);
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Built ${files.length} files in dist/`);
