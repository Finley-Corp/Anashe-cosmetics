import Link from "next/link";
import { Icon } from "@iconify/react";

const SHOP_LINKS = ["New Arrivals", "Best Sellers", "Furniture"];
const SUPPORT_LINKS = ["Help Center", "Shipping & Returns", "Size Guide"];
const COMPANY_LINKS = ["Our Story", "Sustainability", "Careers"];

const SOCIAL = [
  { icon: "lucide:instagram", label: "Instagram" },
  { icon: "lucide:twitter", label: "Twitter" },
  { icon: "lucide:facebook", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-20 pb-10 border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              {SHOP_LINKS.map((l) => (
                <li key={l}>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              {SUPPORT_LINKS.map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-black transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              {COMPANY_LINKS.map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-black transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Follow Us
            </h4>
            <div className="flex gap-4 text-neutral-500">
              {SOCIAL.map(({ icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="hover:text-black transition-colors p-2 bg-neutral-50 rounded-full"
                >
                  <Icon icon={icon} width={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-100 gap-4">
          <div className="text-xl font-bold tracking-tighter">LUMA</div>
          <div className="text-[11px] text-neutral-400 font-medium">
            © {new Date().getFullYear()} LUMA Inc. All rights reserved.
          </div>
          <div className="flex gap-3">
            <div className="h-6 px-2 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center text-neutral-400">
              <Icon icon="lucide:credit-card" width={14} />
            </div>
            <div className="h-6 px-2 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center text-neutral-400">
              <Icon icon="lucide:wallet" width={14} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
