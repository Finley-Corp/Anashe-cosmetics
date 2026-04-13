import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Hero() {
  return (
    <header
      className="relative w-full min-h-[100dvh] lg:h-screen flex items-center bg-white overflow-hidden isolate pt-32 lg:pt-0"
      id="hero"
    >
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-neutral-50 via-neutral-100/50 to-transparent rounded-[100%] blur-3xl -z-10 opacity-70 pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 h-full flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full mt-8 lg:mt-0">

          {/* Left: Copy */}
          <div className="lg:col-span-5 flex flex-col items-start relative z-10">

            {/* Social Proof */}
            <div className="flex items-center gap-3 mb-8 animate-fade-in-up opacity-0 mt-8 lg:mt-0">
              <div className="flex -space-x-2.5">
                <Image
                  className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80"
                  alt="User"
                  width={36}
                  height={36}
                />
                <Image
                  className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80"
                  alt="User"
                  width={36}
                  height={36}
                />
                <Image
                  className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80"
                  alt="User"
                  width={36}
                  height={36}
                />
                <div className="h-9 w-9 rounded-full ring-2 ring-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                  +2k
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex text-neutral-900 text-[10px] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} icon="lucide:star" width={10} className="fill-current" />
                  ))}
                </div>
                <span className="text-xs font-medium text-neutral-500 mt-0.5">
                  Trusted by designers
                </span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-medium tracking-tighter leading-[0.95] mb-6 text-neutral-900 animate-fade-in-up opacity-0 delay-100">
              Timeless design, <br />
              <span className="text-neutral-400">everyday living.</span>
            </h1>

            <p className="text-lg text-neutral-500 mb-10 leading-relaxed max-w-md animate-fade-in-up opacity-0 delay-200">
              Premium furniture designed for the modern sanctuary. Hand-finished
              materials meets ergonomic excellence.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 animate-fade-in-up opacity-0 delay-300">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-500/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Collection
              </Link>
              <Link
                href="/lookbook"
                className="inline-flex items-center justify-center h-12 px-8 bg-white border border-neutral-200 text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-all group"
              >
                <span>View Lookbook</span>
                <Icon
                  icon="lucide:arrow-right"
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  width={16}
                />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-neutral-400 animate-fade-in-up opacity-0 delay-300">
              <div className="flex items-center gap-1.5">
                <Icon icon="lucide:truck" width={14} /> Free Shipping
              </div>
              <div className="flex items-center gap-1.5">
                <Icon icon="lucide:shield-check" width={14} /> 5-Year Warranty
              </div>
            </div>
          </div>

          {/* Right: Product Showcase */}
          <div className="lg:col-span-7 relative h-[500px] lg:h-[70vh] min-h-[400px] w-full animate-fade-in-up opacity-0 delay-200">

            {/* Main Product Image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-neutral-100 group">
              <Image
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2587&auto=format&fit=crop"
                alt="Lounge Chair"
                fill
                className="object-cover object-center transition-transform duration-[1500ms] ease-in-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Detail Card */}
            <div className="absolute bottom-6 left-6 w-64 glass-panel p-4 rounded-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-white/60 z-20 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-0.5">
                    Best Seller
                  </p>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                    Linen Lounge Chair
                  </h3>
                </div>
                <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">
                  $890
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button className="w-5 h-5 rounded-full bg-[#E5E0D5] ring-1 ring-offset-2 ring-neutral-900 cursor-pointer" />
                  <button className="w-5 h-5 rounded-full bg-[#3F3F3F] ring-1 ring-transparent hover:ring-offset-2 hover:ring-neutral-300 transition-all cursor-pointer" />
                  <button className="w-5 h-5 rounded-full bg-[#8C7E72] ring-1 ring-transparent hover:ring-offset-2 hover:ring-neutral-300 transition-all cursor-pointer" />
                </div>
                <button className="w-full h-9 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Icon icon="lucide:shopping-bag" width={14} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Secondary Image */}
            <div className="hidden lg:block absolute -right-8 top-12 w-48 aspect-[3/4] rounded-lg overflow-hidden border-4 border-white shadow-xl animate-fade-in-up opacity-0 delay-300 hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                alt="Room detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
