import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/yly/',  // Set to repository name for GitHub Pages
})
