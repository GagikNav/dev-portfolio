import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gagiknav.dev"),
  title: {
    default: "Gagik — Full-Stack Developer",
    template: "%s — Gagik",
  },
  description:
    "Full-stack developer specialising in React, Next.js, and TypeScript. Building fast, accessible, and well-crafted web products.",
  keywords: ["developer", "full-stack", "React", "Next.js", "TypeScript", "portfolio"],
  authors: [{ name: "Gagik" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gagiknavs.dev",
    title: "Gagik — Full-Stack Developer",
    description:
      "Full-stack developer specialising in React, Next.js, and TypeScript.",
    siteName: "Gagik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gagik — Full-Stack Developer",
    description:
      "Full-stack developer specialising in React, Next.js, and TypeScript.",
  },
  icons: {
    icon: [
      { url: "/assets/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
};

/** Blocking script: apply dark class before first paint to prevent flash */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional blocking theme script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-bg text-fg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
