import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/traditional-chinese-study/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        '**/{vite,tailwind,postcss,eslint}.config.{js,cjs,ts}',
        '**/.eslintrc.{js,cjs}',
        'dist/assets/**',
      ],
    },
  },
}))
