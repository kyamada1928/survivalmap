import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Survival Map: Umeda",
  description: "Quick map for tourists around Umeda, Osaka.",
  icons: [
    { rel: "icon", url: "/icon.svg" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f4c81" />
      </head>
      <body>{children}</body>
    </html>
  );
}
