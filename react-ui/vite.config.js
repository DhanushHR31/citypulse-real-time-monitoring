import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/collection': 'http://localhost:8000',
      '/navigation': 'http://localhost:8000',
      '/predict': 'http://localhost:8000',
      '/events': 'http://localhost:8000',
    }
  }
})
