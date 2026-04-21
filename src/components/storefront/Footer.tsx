import Link from 'next/link';
import { Camera, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-semibold tracking-tighter mb-4 font-[family-name:var(--font-display)]">ANASHE</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-5 max-w-xs">
              Kenya&apos;s skincare and cosmetics destination. Authentic beauty products, secure ordering, fast delivery across Kenya.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/254111330585"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="w-10 h-10 flex items-center justify-center transition-transform hover:scale-105"
              >
                <img src="/images/social.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
              </a>
              <a
                href="https://www.instagram.com/anashe_cosmetics?igsh=bW85ZXh4ODR3dXZj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram"
                className="w-9 h-9 flex items-center justify-center bg-neutral-800 hover:bg-green-700 rounded-full transition-colors"
              >
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-5 text-neutral-300">Shop</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                'New Arrivals',
                'Best Sellers',
                'Serums & Treatments',
                'Moisturisers & Hydration',
                'Sunscreen & SPF',
                'Foundations & Concealer',
                'Lipstick & Lip Gloss',
                'Natural & Organic',
              ].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-5 text-neutral-300">Support</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                { label: 'Help Center', href: '/contact' },
                { label: 'Shipping & Returns', href: '/about' },
                { label: 'Order Tracking', href: '/orders' },
                { label: 'Order & Delivery', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-5 text-neutral-300">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-green-500" />
                <a href="https://wa.me/254111330585" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +254 111 330 585 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-green-500" />
                <span>hello@siscom.africa</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-neutral-400 mb-2">Get skincare tips & beauty drops</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-xs font-semibold transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800 gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Anashe Ltd. All rights reserved. Nairobi, Kenya.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-4 bg-neutral-700 rounded flex items-center justify-center text-[10px] font-bold">M</span>
              Secure Ordering
            </span>
            <span>•</span>
            <span>Fast Delivery Kenya-wide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
