import Link from "next/link";
import Icon from "@/components/Icon";

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
              <li>
                <Link href="/product-listing-page" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Skincare
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li>
                <Link href="/about-us" className="hover:text-black transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-5 text-neutral-900">
              Follow Us
            </h4>
            <div className="flex gap-4 text-neutral-500">
              <Link
                href="#"
                className="hover:text-black transition-colors p-2 bg-neutral-50 rounded-full"
              >
                <Icon icon="lucide:instagram" width="18"></Icon>
              </Link>
              <Link
                href="#"
                className="hover:text-black transition-colors p-2 bg-neutral-50 rounded-full"
              >
                <Icon icon="lucide:twitter" width="18"></Icon>
              </Link>
              <Link
                href="#"
                className="hover:text-black transition-colors p-2 bg-neutral-50 rounded-full"
              >
                <Icon icon="lucide:facebook" width="18"></Icon>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-100 gap-4">
          <div className="text-xl font-bold tracking-tighter">ANASHE</div>
          <div className="text-[11px] text-neutral-400 font-medium">
            © 2023 ANASHE Inc. All rights reserved.
          </div>
          <div className="flex gap-3">
            <div className="h-6 px-2 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center text-neutral-400">
              <Icon icon="lucide:credit-card" width="14"></Icon>
            </div>
            <div className="h-6 px-2 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center text-neutral-400">
              <Icon icon="lucide:wallet" width="14"></Icon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
