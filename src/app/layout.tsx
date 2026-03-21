import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { QuickViewProvider } from "@/components/ui/QuickViewModal";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

export const metadata: Metadata = {
  title: "Anashe | K-Beauty",
  description: "Authentic Korean skincare for radiant skin. Seoul's science at your service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased bg-anashe-bg text-anashe-fg`}>
        <CartProvider>
          <ToastProvider>
            <QuickViewProvider>
              <GlobalLoader />
              {children}
            </QuickViewProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
