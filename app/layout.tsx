import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DWYREX — The King of Compute | GPU Rental Platform',
  description: 'Rent enterprise GPUs at 70% less than AWS. Connect GPU facility owners with AI companies. RTX 3090, RTX 4090, A100, H100 available.',
  keywords: 'GPU rental, GPU kiralama, AI computing, H100, A100, RTX 4090, veri merkezi, data center',
  authors: [{ name: 'DWYREX' }],
  creator: 'DWYREX',
  openGraph: {
    title: 'DWYREX — The King of Compute',
    description: 'Enterprise GPU rental at 70% less than AWS pricing.',
    url: 'https://dwyrex.vercel.app',
    siteName: 'DWYREX',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DWYREX — The King of Compute',
    description: 'Enterprise GPU rental at 70% less than AWS pricing.',
    creator: '@dwyrex',
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
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://dwyrex.vercel.app" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#050508' }}>
        {children}
      </body>
    </html>
  );
}