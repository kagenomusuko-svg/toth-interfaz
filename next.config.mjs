

const nextConfig = {
  transpilePackages: [
    '@toth/ingesta',
    '@toth/extraccion',
    '@toth/abstractivo',
    '@toth/productos',
    '@toth/compositor',
  ],
  webpack: (config) => {
    // pdfjs-dist canvas mock para entornos sin canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
