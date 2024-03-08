import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: './client',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./client/src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: './client/index.html', // путь к вашему входному файлу
    },
  },
  server: {
    proxy: {
      '/api/': 'http://localhost:5000'
    }
  }
})
