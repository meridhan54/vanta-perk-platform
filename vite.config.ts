import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    // Kaynak haritalarını tamamen kapatıyoruz. Cloudflare build sırasında eksik .map dosyası hatasını engeller.
    sourcemap: false,
    // Modern minification ayarı
    minify: 'esbuild',
    rollupOptions: {
      // Build'i durduran veya kirleten uyarıları filtreliyoruz
      onwarn(warning, warn) {
        // React Router 7 "use client" yönergesi ve eksik sourcemap hataları build'i bozmasın
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
          warning.code === 'SOURCEMAP_ERROR' ||
          warning.message.includes('use client') ||
          warning.message.includes('sourcemap')
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  // Paket çözünürlüğü için modern modül öncelikleri
  resolve: {
    mainFields: ['module', 'main'],
  }
});