import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import netlify from '@netlify/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Disable Netlify middleware in dev so the proxy handles /api.
  plugins: [react(), ...(command === 'build' ? [netlify()] : [])],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888', // Backend server
        changeOrigin: true,             // Necessary for virtual hosted sites
        secure: false                  // Set to true if using HTTPS with valid certs
      }
    }
  }
}))
