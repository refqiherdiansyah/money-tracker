import "./globals.scss";
import type { Metadata } from "next";
import type React from "react";

import Providers from "./providers";
import BottomNav from "@/app/components/BottomNav";

import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
