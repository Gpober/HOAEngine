/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Demo images are local SVG/placeholder assets by default. If you add remote
    // photography, whitelist the host here (see README "Replacing images").
    remotePatterns: [],
  },
};

export default nextConfig;
