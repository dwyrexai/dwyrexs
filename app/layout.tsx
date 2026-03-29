import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Dwyrex",
    template: "%s | Dwyrex",
  },
  description:
    "Dwyrex - Modern web teknolojileri, yazılım geliştirme ve teknoloji üzerine blog.",
  keywords: ["dwyrex", "blog", "yazılım", "teknoloji", "web geliştirme"],
  authors: [{ name: "Dwyrex" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Dwyrex",
    title: "Dwyrex",
    description: "Modern web teknolojileri ve yazılım üzerine blog.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwyrex",
    description: "Modern web teknolojileri ve yazılım üzerine blog.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300"
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}