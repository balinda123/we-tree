import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'example', // 将 example 设为根目录
  plugins: [react()],
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      'mix-tree': path.resolve(__dirname, './src/index.ts')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
