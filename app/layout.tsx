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
    title: "Ascii Cast | ASCII Art Animation",
    description: "Convert webcam feeds, or videos into ASCII art Animation and Mint to Base Network",
    openGraph: {
      title: "Ascii Cast | Create Art ASCII Animation",
      description: "Convert webcam feeds, or videos into ASCII art Animation and Mint to Base Network",
      url: "https://www.asciicast.com",
      type: 'website',
      images: [
        {
          url: "https://www.asciicast.com/og-image.jpg",
          width: 1200,
          height: 600,
          alt: 'Mint your ASCII Art Animation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Ascii Cast | ASCII Art Animation",
      description: "Convert webcam feeds, or videos into ASCII art Animation and Mint to Base Network",
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
