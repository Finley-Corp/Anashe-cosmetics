import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Newsreader, Oswald, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANASHE — Advanced Botanical Skincare",
  description: "Unlock the secret to ageless luminosity. ANASHE fuses rare botanicals with clinical precision to restore your skin's natural radiance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bricolage.variable} ${newsreader.variable} ${oswald.variable} ${dmSans.variable} antialiased bg-neutral-950 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
