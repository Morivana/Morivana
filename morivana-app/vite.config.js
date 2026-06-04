import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 1600,
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5179',
    },
  },
})
