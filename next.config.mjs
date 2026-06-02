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
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "openfreemap-assets",
        expiration: {
          maxEntries: 220,
          maxAgeSeconds: 60 * 60 * 24 * 14,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname === "/",
      handler: "NetworkFirst",
      options: {
        cacheName: "app-shell",
        networkTimeoutSeconds: 4,
        expiration: {
          maxEntries: 8,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "image-assets",
        expiration: {
          maxEntries: 96,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
};

export default withPWA(pwaOptions)(nextConfig);
