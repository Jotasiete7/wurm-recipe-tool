import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@antigravity': path.resolve(__dirname, '../antigravity')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})