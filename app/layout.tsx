import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AsciiProvider } from "@/context/AsciiProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import Provider from "./providers/Provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "asciicast | video to ascii",
    description: "convert webcam stream or videos into ascii",
    openGraph: {
      title: "asciicast | video to ascii",
      description: "convert webcam stream or videos into ascii",
      url: "https://www.asciicast.com",
      type: 'website',
      images: [
        {
          url: "https://www.asciicast.com/og-image.jpg",
          width: 1200,
          height: 600,
          alt: 'video to ascii',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "asciicast | video to ascii",
      description: "convert webcam stream or videos into ascii",
      images: ["https://www.asciicast.com/og-image.jpg"],
    },
    manifest: "/manifest.json",
    icons: {
      icon: '/favicon.ico',
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <Provider>
          <AsciiProvider>
            <TooltipProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </TooltipProvider>
          </AsciiProvider>
        </Provider>
      </body>
    </html>
  );
}
