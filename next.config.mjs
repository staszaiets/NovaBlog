/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  output: 'standalone',
  images: {
    domains: [
      'strapi-upload-images-prod.s3.eu-west-2.amazonaws.com',
      'admin-dev.jaecoo.co.uk',
      'admin-prod.jaecoo.co.uk',
      'localhost',
      '127.0.0.1',
      'admin-prod-v4.jaecoo.co.uk',
    ],
  },
};

export default nextConfig;
