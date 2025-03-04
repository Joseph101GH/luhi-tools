import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Using proper repository name for GitHub Pages
  base: '/luhi-tools/',
  plugins: [react(), tailwindcss()],
})
