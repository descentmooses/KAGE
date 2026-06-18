import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site — always build with /KAGE/ base for production
const base = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
  ? '/KAGE/'
  : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
