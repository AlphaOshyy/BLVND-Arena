import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  base: '/BLVND-Arena/',
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'src/lucide-react-compat.js')
    }
  }
})
