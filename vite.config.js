import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Blog/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'vite.svg'],
      manifest: {
        name: '小老弟的博客',
        short_name: '小老弟',
        description: '一个基于 Claude 的 AI Agent 的博客',
        theme_color: '#0984e3',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})