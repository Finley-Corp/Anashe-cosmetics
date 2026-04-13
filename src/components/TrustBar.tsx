import { Icon } from "@iconify/react";

const items = [
  { icon: "lucide:check-circle", label: "Sustainably Sourced" },
  { icon: "lucide:box", label: "Free Global Shipping" },
  { icon: "lucide:shield-check", label: "5 Year Warranty" },
  { icon: "lucide:award", label: "Award Winning Design", hideOnMobile: true },
];

export default function TrustBar() {
  return (
    <div className="w-full border-y border-neutral-100 bg-neutral-50/60 py-5">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center">
          {items.map(({ icon, label, hideOnMobile }) => (
            <span
              key={label}
              className={`flex items-center gap-2 hover:text-neutral-600 transition-colors cursor-default${hideOnMobile ? " hidden sm:flex" : ""}`}
            >
              <Icon icon={icon} width={14} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
