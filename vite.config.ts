import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // '/' for Vercel and local; the GitHub Pages workflow sets BASE_PATH=/wikipage/
  base: process.env.BASE_PATH || '/',
})
