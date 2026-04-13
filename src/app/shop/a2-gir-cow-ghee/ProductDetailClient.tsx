"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

type SizeOption = {
  id: string;
  label: string;
  price: number;
  compareAt: number;
  popular?: boolean;
};

const GALLERY = [
  "https://images.unsplash.com/photo-1706881811929-9c7454f9eda7?w=1600&q=80",
  "https://images.unsplash.com/photo-1706881811933-91780526cdc1?w=1200&q=80",
  "https://images.unsplash.com/photo-1706881811917-6590b1054050?w=1200&q=80",
  "https://images.unsplash.com/photo-1706881811931-12e3692a20b2?w=1200&q=80",
];

const SIZE_OPTIONS: SizeOption[] = [
  { id: "250ml", label: "250ml", price: 990, compareAt: 1150 },
  { id: "500ml", label: "500ml", price: 1850, compareAt: 2100, popular: true },
  { id: "1-litre", label: "1 Litre", price: 3400, compareAt: 3900 },
];

const REVIEWS = [
  {
    name: "Rajesh K.",
    city: "Mumbai",
    initials: "RK",
    content:
      "Reminds me of my grandmother's ghee. The aroma when I put it on hot rotis is unmistakable. Finally found something authentic.",
  },
  {
    name: "Sneha M.",
    city: "Bangalore",
    initials: "SM",
    content:
      "I use it for my baby's dal khichdi. The texture is grainy just like homemade ghee. Highly recommend for health conscious families.",
  },
  {
    name: "Amit D.",
    city: "Delhi",
    initials: "AD",
    content:
      "The packaging was excellent, zero leakage. The taste is subtle and not overpowering. Will definitely subscribe.",
  },
];

export default function ProductDetailClient() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("500ml");
  const [quantity, setQuantity] = useState(1);

  const currentSize = useMemo(
    () => SIZE_OPTIONS.find((s) => s.id === selectedSize) ?? SIZE_OPTIONS[1],
    [selectedSize]
  );
  const total = currentSize.price * quantity;

  return (
    <div className="selection:bg-[#E8E4D9]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20 lg:pt-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full bg-[#F0EFE9] rounded-lg overflow-hidden relative group">
              <Image
                src={GALLERY[activeImage]}
                alt="A2 Gir Cow Ghee Jar"
                fill
                priority
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {GALLERY.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-md overflow-hidden transition-opacity ${
                    i === activeImage
                      ? "ring-1 ring-[#2F3E30] opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View product image ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Product thumbnail ${i + 1}`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-3 border-b border-[#E8E4D9] pb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8E4D9] text-[#5C5C5C]">
                    Best Seller
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#7D6A58] bg-orange-50/50">
                    Single Origin
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1A1A]">
                  Traditional A2 Gir Cow Ghee
                </h1>
                <p className="text-base text-[#5C5C5C] leading-relaxed">
                  Hand-churned using the Bilona method for a grainy texture and
                  nutty aroma. Pure, golden nourishment for your family.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#D97706]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} icon="lucide:star" className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-[#5C5C5C] hover:underline cursor-pointer">
                    4.9 (1,240 Reviews)
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-medium text-[#1A1A1A]">
                  KSh {currentSize.price.toLocaleString()}
                  </span>
                  <span className="text-base text-[#9CA3AF] line-through font-light">
                    KSh {currentSize.compareAt.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#2F3E30] font-medium">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#4A4A4A]">
                  Select Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SIZE_OPTIONS.map((size) => {
                    const active = selectedSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`rounded-lg py-3 px-4 text-sm transition-colors relative ${
                          active
                            ? "border-2 border-[#2F3E30] bg-[#2F3E30]/5 font-medium text-[#1A1A1A]"
                            : "border border-[#E8E4D9] hover:border-[#2F3E30] text-[#5C5C5C]"
                        }`}
                      >
                        {size.label}
                        {size.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#2F3E30] text-white text-[10px] px-1.5 py-0.5 rounded">
                            Most Popular
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex items-center border border-[#E8E4D9] rounded-lg w-32 justify-between px-3 h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-[#5C5C5C] hover:text-[#1A1A1A] text-lg"
                    >
                      -
                    </button>
                    <span className="text-base font-medium text-[#1A1A1A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-[#5C5C5C] hover:text-[#1A1A1A] text-lg"
                    >
                      +
                    </button>
                  </div>
                  <button className="flex-1 bg-[#2F3E30] hover:bg-[#243025] text-white font-medium rounded-lg h-12 shadow-sm transition-all duration-300 flex items-center justify-center gap-2 group">
                    <span>Add to Cart • KSh {total.toLocaleString()}</span>
                    <Icon
                      icon="lucide:arrow-right"
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-[#5C5C5C] pt-2">
                  <span className="flex items-center gap-1.5">
                    <Icon icon="lucide:check-circle" className="w-3.5 h-3.5 text-[#2F3E30]" />
                    Lab Tested
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E4D9]" />
                  <span className="flex items-center gap-1.5">
                    <Icon icon="lucide:leaf" className="w-3.5 h-3.5 text-[#2F3E30]" />
                    No Preservatives
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E4D9]" />
                  <span className="flex items-center gap-1.5">
                    <Icon icon="lucide:truck" className="w-3.5 h-3.5 text-[#2F3E30]" />
                    Farm to Jar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[#EFECE6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <Feature
              icon="lucide:heart"
              title="Heart Healthy Fats"
              text="Rich in Omega-3s and butyric acid, supporting gut health and easier digestion compared to regular butter."
            />
            <Feature
              icon="lucide:sprout"
              title="Traditional Bilona Method"
              text="Curd is churned two ways to extract butter, then slow-heated for maximum purity and flavor."
            />
            <Feature
              icon="lucide:award"
              title="Authentic A2 Milk"
              text="Sourced strictly from free-grazing Gir cows, ensuring pure A2 protein free from hormones."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F8F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 items-center">
            <div className="order-2 md:order-1 relative rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1706881811935-9ffbcd5a1049?w=1600&q=80"
                alt="Traditional village process"
                width={1200}
                height={1400}
                className="w-full h-[500px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white/90 text-sm font-medium">
                <Icon icon="lucide:map-pin" className="inline w-4 h-4 mr-1" />
                Sourced from Gujarat, India
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl text-[#2F3E30] tracking-tight">
                Slow churned.
                <br />
                Never rushed.
              </h2>
              <p className="text-[#5C5C5C] leading-relaxed">
                In an era of machine-processed oils, we take a step back. The milk
                from free-grazing Gir cows is boiled and set to curd in earthen
                pots before it is hand churned.
              </p>
              <p className="text-[#5C5C5C] leading-relaxed">
                The curd is churned using a wooden Bilona to separate butter,
                then slowly heated over a low flame to produce pure, golden,
                danedar ghee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E4D9] pt-16 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl text-[#1A1A1A] text-center mb-10 tracking-tight">
            Transparency in every spoon
          </h2>
          <div className="bg-white rounded-xl border border-[#E8E4D9] divide-y divide-[#E8E4D9]">
            <DisclosureRow
              title="Ingredients"
              value="100% Clarified Butter from A2 Cow Milk"
            />
            <DisclosureRow
              title="Nutrition Facts (Per 100g)"
              value="Energy: 898 Kcal • Fat: 99.8g • Protein: 0g"
            />
            <DisclosureRow
              title="Storage Instructions"
              value="Store in a cool, dry place. Use a dry spoon."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl text-[#1A1A1A] tracking-tight">
              Stories from Indian Kitchens
            </h2>
            <a href="#" className="text-sm font-medium text-[#5C5C5C] hover:text-[#1A1A1A]">
              View all reviews
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <article
                key={review.name}
                className="bg-white p-6 rounded-lg border border-[#E8E4D9] shadow-sm"
              >
                <div className="flex text-[#D97706] mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon="lucide:star" className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8E4D9] flex items-center justify-center text-xs font-medium text-[#7D6A58]">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1A1A1A]">{review.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">
                      Verified Buyer • {review.city}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E8E4D9] p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <p className="text-xs text-[#5C5C5C]">A2 Gir Cow Ghee ({currentSize.label})</p>
            <p className="font-medium text-[#1A1A1A]">KSh {currentSize.price.toLocaleString()}</p>
          </div>
          <button className="bg-[#2F3E30] text-white px-8 py-3 rounded-lg font-medium text-sm w-auto shadow-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
      <div className="w-12 h-12 rounded-full bg-[#E4DFCF] flex items-center justify-center shrink-0 border border-[#D6CEC0]">
        <Icon icon={icon} className="w-6 h-6 text-[#7D6A58]" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-[#2F3E30] mb-1">{title}</h3>
        <p className="text-sm text-[#5C5C5C] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function DisclosureRow({ title, value }: { title: string; value: string }) {
  return (
    <button className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors group text-left">
      <div>
        <span className="block text-sm font-medium text-[#1A1A1A]">{title}</span>
        <span className="block text-sm text-[#5C5C5C] mt-1">{value}</span>
      </div>
      <Icon icon="lucide:plus" className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1A1A1A]" />
    </button>
  );
}

