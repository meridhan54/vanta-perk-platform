import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    // Kaynak haritalarını tamamen kapatıyoruz, böylece eksik dosya hatası alınmaz
    sourcemap: false,
    // Terser yerine esbuild kullanarak daha hızlı ve hatasız derleme sağlıyoruz
    minify: 'esbuild',
    rollupOptions: {
      // Build'i durduran tüm uyarıları susturuyoruz
      onwarn(warning, warn) {
        // React Router 7 "use client" ve sourcemap hatalarını filtrele
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
  // Modern modül çözünürlüğü ayarları
  resolve: {
    mainFields: ['module', 'main'],
  }
});
