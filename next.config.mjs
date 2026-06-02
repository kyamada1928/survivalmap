import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

const pwaOptions = {
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaOptions)(nextConfig);
