import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: '',
  plugins: [
    vue(),
    isProduction && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'img/**/*', 'sounds/**/*'],
      manifest: {
        name: 'Edukiz - Educational Games for Kids',
        short_name: 'Edukiz',
        description: 'Simple educational games for children',
        theme_color: '#37373e',
        background_color: '#37373e',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3,woff2}'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'mitt'],
          interact: ['@interactjs/interact', '@interactjs/interactjs']
        }
      }
    }
  },
  server: {
    port: 8080,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/registerServiceWorker.js', '**/*.config.*']
    },
    setupFiles: ['tests/setup.js']
  }
})