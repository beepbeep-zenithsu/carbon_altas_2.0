import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/carbon_altas_2.0/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})