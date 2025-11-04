import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Use PostCSS to run Tailwind; do not import `@tailwindcss/vite` which is ESM-only
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
