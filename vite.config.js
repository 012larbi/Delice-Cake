import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    // Le SDK Firebase est chargé à la demande (admin / prod configurée)
    chunkSizeWarningLimit: 900,
  },
})
