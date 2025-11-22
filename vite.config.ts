import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Essential for GitHub Pages deployment to handle subpaths correctly
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});