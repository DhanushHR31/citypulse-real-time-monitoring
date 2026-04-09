import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5175,
    proxy: {
      '/collection': 'http://127.0.0.1:8000',
      '/navigation': 'http://127.0.0.1:8000',
      '/predict': 'http://127.0.0.1:8000',
      '/events': 'http://127.0.0.1:8000',
      '/users': 'http://127.0.0.1:8000',
    }
  }
})
