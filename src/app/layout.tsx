import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "LUMA | Elevated Essentials",
  description:
    "Premium furniture designed for the modern sanctuary. Hand-finished materials meets ergonomic excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${oswald.variable} ${playfair.variable} bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white relative`}
      >
        {children}
      </body>
    </html>
  );
}
