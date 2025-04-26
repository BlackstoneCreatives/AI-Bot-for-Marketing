module.exports = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Fix for postcss plugins
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};
