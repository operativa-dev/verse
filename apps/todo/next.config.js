/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("better-sqlite3");
    }

    return config;
  },
};

export default nextConfig;
