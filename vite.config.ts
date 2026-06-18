import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

// GitHub Pages project site — always build with /KAGE/ base for production
const base = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
  ? '/KAGE/'
  : '/'

// Stable for the duration of each build/dev session
const buildVersion = Date.now().toString()

function versionPayload(version: string) {
  return JSON.stringify({ version, builtAt: new Date().toISOString() }, null, 2)
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
  plugins: [react(), tailwindcss(), cacheBustPlugin(), cacheBustMetaPlugin(), cacheBustAssetsPlugin()],
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
