export default {
  test: {
    globals: true,
    environment: 'jsdom',
    testMatch: ['./src/components/tests/*.test.js'],
  },
  coverage: {
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/'],
  },
};
