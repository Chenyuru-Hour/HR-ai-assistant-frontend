import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('element-plus')) {
            return 'element-plus'
          }

          if (id.includes('@element-plus/icons-vue')) {
            return 'element-icons'
          }

          if (
            id.includes('vue-router') ||
            id.includes('pinia') ||
            id.includes('/vue/')
          ) {
            return 'vue-vendor'
          }
        }
      }
    }
  }
})
  