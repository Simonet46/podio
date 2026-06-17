/** @type {import('next').NextConfig} */

// La web se sirve desde GitHub Pages en https://<user>.github.io/podio
// Para correr en local sin el prefijo, dejá BASE_PATH vacío (npm run dev).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  // Exportación 100% estática (GitHub Pages, sin servidor).
  output: "export",
  basePath,
  // Genera carpetas con index.html (mejor para GitHub Pages).
  trailingSlash: true,
  images: {
    // GitHub Pages no corre el optimizador de Next → servimos las imágenes tal cual.
    // Ya están en WebP comprimido, así que pesan poco.
    unoptimized: true,
  },
};

export default nextConfig;
