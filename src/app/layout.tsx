import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Anashe | Elevated Essentials",
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
        className={`${inter.variable} ${crimson.variable} bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white relative`}
      >
        {children}
      </body>
    </html>
  );
}
