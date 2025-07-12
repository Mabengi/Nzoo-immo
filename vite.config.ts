import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'nzoo-immo.onrender.com',
      'nzoo-immo-4.onrender.com'
    ]
  }
})



