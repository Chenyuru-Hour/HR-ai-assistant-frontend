import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import path from 'path'

// https://vite.dev/config/   // 生产环境打包配置
export default defineConfig({
  plugins: [vue(), Unocss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 代码分割配置
        manualChunks(id) {
          // 只对 node_modules 中的依赖进行分割
          if (!id.includes('node_modules')) {
            return
          }
          // 将 element-plus 相关的依赖打包到一个单独的 chunk 中
          if (id.includes('element-plus')) {
            return 'element-plus'
          }
          // 将 element-plus 的图标库打包到一个单独的 chunk 中
          if (id.includes('@element-plus/icons-vue')) {
            return 'element-icons'
          }
          //
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
  