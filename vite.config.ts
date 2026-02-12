import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/p
export default defineConfig({
  server: {
    host: true,
    port: 18600,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://bulk.iambeyouare.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
