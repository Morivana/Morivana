import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 1600,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('@clerk')) {
              return 'vendor-clerk';
            }
            if (id.includes('gsap') || id.includes('lenis') || id.includes('animejs')) {
              return 'vendor-animation';
            }
            if (
              (id.includes('react') || id.includes('scheduler') || id.includes('react-router')) &&
              !id.includes('react-three') &&
              !id.includes('@react-three')
            ) {
              return 'vendor-core';
            }
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5179',
    },
  },
})
