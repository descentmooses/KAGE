import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import pkg from './package.json' with { type: 'json' }

const GH_PAGES_ORIGIN = 'https://descentmooses.github.io'

// GitHub Pages project site — always build with /KAGE/ base for production
const base = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
  ? '/KAGE/'
  : '/'

const isGhPagesBuild =
  process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'

function pwaManifestUrl(path: string): string {
  const clean = path.replace(/^\//, '')
  if (isGhPagesBuild) {
    return `${GH_PAGES_ORIGIN}/KAGE/${clean}`
  }
  const b = base.endsWith('/') ? base : `${base}/`
  return `${b}${clean}`
}

const scope = pwaManifestUrl('')
const startUrl = pwaManifestUrl('?source=pwa')
const manifestId = pwaManifestUrl('')

function m(path: string) {
  return pwaManifestUrl(path)
}

// Unique per build — used for cache busting on GitHub Pages
const buildVersion = Date.now().toString()
const appVersion = pkg.version

function versionPayload(version: string) {
  return JSON.stringify(
    { version, appVersion, builtAt: new Date().toISOString() },
    null,
    2,
  )
}

function serveVersionJson(version: string) {
  return (_req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.end(versionPayload(version))
  }
}

function cacheBustMetaPlugin(): Plugin {
  return {
    name: 'kage-cache-bust-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        const meta = [
          `<meta name="build-version" content="${buildVersion}" />`,
          `<meta name="app-version" content="${appVersion}" />`,
          '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />',
          '<meta http-equiv="Pragma" content="no-cache" />',
          '<meta http-equiv="Expires" content="0" />',
        ].join('\n    ')
        return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${meta}`)
      },
    },
  }
}

function cacheBustAssetsPlugin(): Plugin {
  return {
    name: 'kage-cache-bust-assets',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        return html.replace(
          /((?:src|href)="[^"]*\/assets\/[^"?]+)(\?[^"]*)?(")/g,
          `$1?v=${buildVersion}$3`,
        )
      },
    },
  }
}

function absoluteManifestPlugin(): Plugin {
  return {
    name: 'kage-absolute-manifest',
    closeBundle() {
      if (!isGhPagesBuild) return
      const indexPath = join(process.cwd(), 'dist', 'index.html')
      const html = readFileSync(indexPath, 'utf8')
      const next = html.replace(
        /href="\/KAGE\/manifest\.json"/g,
        'href="https://descentmooses.github.io/KAGE/manifest.json"',
      )
      if (next !== html) writeFileSync(indexPath, next)
    },
  }
}

function cacheBustPlugin(): Plugin {
  return {
    name: 'kage-cache-bust',
    configureServer(server: ViteDevServer) {
      const handler = serveVersionJson('dev')
      server.middlewares.use('/version.json', handler)
      server.middlewares.use('/KAGE/version.json', handler)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: versionPayload(buildVersion),
      })
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    cacheBustPlugin(),
    cacheBustMetaPlugin(),
    cacheBustAssetsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      manifestFilename: 'manifest.json',
      includeAssets: [
        'favicon.svg',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
        'screenshots/narrow.png',
        'screenshots/wide.png',
      ],
      manifest: {
        id: manifestId,
        name: 'KAGE — Shadow Mastery',
        short_name: 'KAGE',
        description:
          'Personal shadow mastery tracker for Mind 心, Body 体, and Spirit 魂. Offline-first discipline companion.',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        start_url: startUrl,
        scope,
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: m('icons/icon-192.png'),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: m('icons/icon-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: m('icons/icon-maskable-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: m('screenshots/narrow.png'),
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'KAGE daily triad and quick log',
          },
          {
            src: m('screenshots/wide.png'),
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Shadow mastery dashboard',
          },
        ],
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfont',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
    absoluteManifestPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
