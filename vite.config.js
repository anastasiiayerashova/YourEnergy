import { defineConfig } from 'vite';
import { globSync } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  root: 'src',
  base: '/YourEnergy/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: globSync('./src/*.html'),
    },
  },
  plugins: [
    injectHTML(),
    FullReload(['./src/**/*.html']),
  ],
});