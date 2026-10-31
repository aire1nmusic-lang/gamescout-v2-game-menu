import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the same build works on GitHub Pages under /<repo>/ and locally.
export default defineConfig({ plugins: [react()], base: './' })
