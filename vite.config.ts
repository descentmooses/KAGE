import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site — always build with /KAGE/ base for production
const base = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
  ? '/KAGE/'
  : '/'

function cacheBustPlugin(): Plugin {
  let buildVersion = ''

  return {
    name: 'kage-cache-bust',
    config() {
      buildVersion = Date.now().toString()
    },
    transformIndexHtml(html) {
      const meta = [
        `<meta name="build-version" content="${buildVersion}" />`,
        '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />',
        '<meta http-equiv="Pragma" content="no-cache" />',
        '<meta http-equiv="Expires" content="0" />',
      ].join('\n    ')
      return html.replace('</head>', `    ${meta}\n  </head>`)
    },
    generateBundle() {
      const payload = JSON.stringify(
        { version: buildVersion, builtAt: new Date().toISOString() },
        null,
        2,
      )
      this.emitFile({ type: 'asset', fileName: 'version.json', source: payload })
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), cacheBustPlugin()],
  build: {
    // Content-hashed filenames — safe for long-term caching of JS/CSS
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
