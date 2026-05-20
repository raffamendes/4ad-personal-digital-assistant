import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Remove /api prefix when sending to Quarkus since @Path is /characters
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
