import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { EngagementPopups } from '@/components/storefront/EngagementPopups';
import { RevealObserver } from '@/components/storefront/RevealObserver';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
      <a
        href="https://wa.me/254111330585"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center transition-transform hover:scale-105"
      >
        <img src="/images/social.png" alt="WhatsApp" className="h-14 w-14 object-contain" />
      </a>
      <EngagementPopups />
      <RevealObserver />
    </>
  );
}
