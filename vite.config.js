import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: '/BLVND-Arena/',
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'src/lucide-react-compat.js')
    }
  }
})
