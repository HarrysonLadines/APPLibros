import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/app/setupTests.ts',
    include: [
      "tests/**/*.{test,spec}.{js,ts,jsx,tsx}", // busca en /tests
      "src/**/*.{test,spec}.{js,ts,jsx,tsx}"    // busca en /src también
    ],
  },
})
