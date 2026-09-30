const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  transpilePackages: [
    '@toth/ingesta',
    '@toth/extraccion',
    '@toth/abstractivo',
    '@toth/productos',
    '@toth/compositor',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
