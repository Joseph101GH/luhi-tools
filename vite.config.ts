import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/luhi-tools/',
  plugins: [react(), tailwindcss()],
  base: './', // Set base path for GitHub Pages
})
