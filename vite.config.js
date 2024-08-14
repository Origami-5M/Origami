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
        play: resolve(__dirname, 'play.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        shareDetail: resolve(__dirname, 'shareDetail.html'),
        completePage: resolve(__dirname, 'completePage.html'),
        accessDenied: resolve(__dirname, 'accessDenied.html'),
      },
    },
  },
});
