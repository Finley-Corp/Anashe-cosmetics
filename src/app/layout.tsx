import type { Metadata } from 'next';
import { Delius, Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/shared/Toaster';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const delius = Delius({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-delius',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Anashe | Premium African Essentials',
    template: '%s | Anashe',
  },
  description:
    'Anashe is Kenya\'s premier online store for curated premium essentials. Quality products, M-Pesa payments, fast delivery.',
  keywords: ['Kenya', 'online store', 'M-Pesa', 'shopping', 'premium products'],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Anashe',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} ${roboto.variable} ${delius.variable} bg-white text-neutral-900 selection:bg-[var(--primary)] selection:text-white relative`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
