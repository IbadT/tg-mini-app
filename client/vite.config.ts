import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    port: 5173
  },
  publicDir: './public',
  build: {
    target: 'esnext',
  },
})
