import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: './client',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./client/src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: './client/index.html'
    }
  },
  server: {
    proxy: {
      '/api/': 'http://localhost:5000'
    }
  },
})
