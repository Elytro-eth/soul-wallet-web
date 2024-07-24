import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import path from 'path';
import removeConsole from "vite-plugin-remove-console";
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    headers:{
      "Content-Security-Policy" :"script-src 'self' 'unsafe-inline'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: false,
    }),
    removeConsole(),
    compression({
      threshold: 10240,
      deleteOriginFile: false,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
