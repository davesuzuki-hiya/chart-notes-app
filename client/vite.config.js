import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment - change 'chart-notes-app' to your repo name
  base: process.env.NODE_ENV === 'production' ? '/chart-notes-app/' : '/',
});
