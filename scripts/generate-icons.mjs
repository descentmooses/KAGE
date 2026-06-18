import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const iconsDir = resolve(publicDir, 'icons')
const shotsDir = resolve(publicDir, 'screenshots')

if (!existsSync(shotsDir)) mkdirSync(shotsDir, { recursive: true })

const iconSvg = readFileSync(resolve(iconsDir, 'icon.svg'))

for (const size of [192, 512]) {
  await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toFile(resolve(iconsDir, `icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

// Maskable — extra padding for adaptive icons
await sharp(iconSvg)
  .resize(410, 410)
  .extend({
    top: 51,
    bottom: 51,
    left: 51,
    right: 51,
    background: { r: 5, g: 5, b: 5, alpha: 1 },
  })
  .png()
  .toFile(resolve(iconsDir, 'icon-maskable-512.png'))
console.log('Generated icon-maskable-512.png')

const narrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="720" viewBox="0 0 540 720">
  <rect width="540" height="720" fill="#050505"/>
  <rect x="24" y="48" width="492" height="624" rx="28" fill="#0a0a0a" stroke="#c41e3a" stroke-width="2" opacity="0.35"/>
  <text x="270" y="200" text-anchor="middle" font-family="serif" font-size="120" fill="#c41e3a">影</text>
  <text x="270" y="280" text-anchor="middle" font-family="sans-serif" font-size="22" letter-spacing="8" fill="#e85d4c">KAGE</text>
  <text x="270" y="340" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#9a9198">心 · 体 · 魂</text>
  <rect x="60" y="400" width="420" height="12" rx="6" fill="#1a1416"/>
  <rect x="60" y="400" width="300" height="12" rx="6" fill="#c41e3a" opacity="0.8"/>
  <rect x="60" y="440" width="420" height="12" rx="6" fill="#1a1416"/>
  <rect x="60" y="440" width="260" height="12" rx="6" fill="#e85d4c" opacity="0.7"/>
  <rect x="60" y="480" width="420" height="12" rx="6" fill="#1a1416"/>
  <rect x="60" y="480" width="340" height="12" rx="6" fill="#c41e3a" opacity="0.6"/>
  <text x="270" y="560" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#7a6e72">Shadow mastery · offline</text>
</svg>`

const wideSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#050505"/>
  <rect x="80" y="60" width="520" height="600" rx="24" fill="#0a0a0a" stroke="#c41e3a" stroke-width="2" opacity="0.3"/>
  <text x="340" y="280" text-anchor="middle" font-family="serif" font-size="160" fill="#c41e3a">影</text>
  <text x="340" y="380" text-anchor="middle" font-family="sans-serif" font-size="28" letter-spacing="12" fill="#e85d4c">KAGE</text>
  <text x="760" y="200" font-family="sans-serif" font-size="36" fill="#f8f0f2">Mind · Body · Spirit</text>
  <text x="760" y="260" font-family="sans-serif" font-size="18" fill="#9a9198">Daily discipline tracker for the path out.</text>
  <text x="760" y="340" font-family="sans-serif" font-size="16" fill="#7a6e72">Quick log · Elara whispers · Freedom goals</text>
  <text x="760" y="400" font-family="sans-serif" font-size="16" fill="#7a6e72">Fully offline · IndexedDB · PWA</text>
</svg>`

await sharp(Buffer.from(narrowSvg)).png().toFile(resolve(shotsDir, 'narrow.png'))
console.log('Generated screenshots/narrow.png')

await sharp(Buffer.from(wideSvg)).png().toFile(resolve(shotsDir, 'wide.png'))
console.log('Generated screenshots/wide.png')
