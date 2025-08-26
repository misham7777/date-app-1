import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/conditional-navbar";
import { GlobalBackground } from "@/components/ui/global-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relationship Intel - Discover the Truth",
  description: "Advanced AI-powered relationship intelligence platform. Find hidden dating profiles across 50+ platforms with facial recognition technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <GlobalBackground>
          <div className="relative w-full overflow-x-hidden">
            <ConditionalNavbar />
            {children}
          </div>
        </GlobalBackground>
      </body>
    </html>
  );
}
