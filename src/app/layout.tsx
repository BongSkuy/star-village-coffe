import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://starvillage.coffee'),
  title: "Star Village Coffee - Menu & Harga | Coffee Shop Boyolali",
  description: "Star Village Coffee - Coffee shop terbaik di Boyolali dengan menu lengkap: kopi, makanan, dan minuman lezat dengan harga terjangkau. Free WiFi, area luas, mushola tersedia.",
  keywords: ["Star Village Coffee", "Coffee Shop Boyolali", "Kopi Boyolali", "Kopi Susu", "Nongkrong Boyolali", "Cafe Boyolali", "Menu Coffee", "Kopi Susu Aren", "Nasi Goreng"],
  authors: [{ name: "Star Village Coffee" }],
  creator: "Star Village Coffee",
  publisher: "Star Village Coffee",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Star Village Coffee - Menu & Harga | Coffee Shop Boyolali",
    description: "Coffee shop terbaik di Boyolali dengan menu lengkap: kopi, makanan, minuman lezat. Free WiFi, area luas, mushola tersedia. Pesan online sekarang!",
    url: "https://starvillage.coffee",
    siteName: "Star Village Coffee",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Star Village Coffee - Menu & Harga",
    description: "Coffee shop terbaik di Boyolali dengan menu lengkap dan harga terjangkau.",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
