import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
  ],
  test: {
    // Global timeout for tests in milliseconds
    testTimeout: 50000,
    // Other test configurations if needed
    pool: 'forks',
    // Include any other test-specific settings here
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src/'),
    },
  },
});
