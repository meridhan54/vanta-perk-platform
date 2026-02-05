import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    // Sourcemap hatasını engellemek için kapatıyoruz
    sourcemap: false,
    rollupOptions: {
      // "use client" yönergesi uyarılarını susturur
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  }
});