import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    testMatch: ['./src/components/tests/**/*.test.js'],
  },
  coverage: {
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/'],
  },
});
