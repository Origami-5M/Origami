/* eslint-disable */
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        completePage: resolve(__dirname, 'completePage.html'),
      },
    },
  },
});
