"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div id="loader" className="loader-overlay">
      <div className="flex flex-col items-center gap-4">
        <span className="text-xl font-medium tracking-tighter">ANASHE</span>
        <div className="h-0.5 w-24 bg-neutral-100 overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-neutral-900 w-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
