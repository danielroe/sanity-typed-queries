import { fileURLToPath } from 'node:url'
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'sanity-typed-queries': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    coverage: {
      include: ['src'],
      reporter: ['text', 'json', 'html'],
    },
  },
})
