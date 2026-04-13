"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="w-full py-24 bg-neutral-900 text-white" id="newsletter">
      <div className="max-w-screen-xl mx-auto px-6 text-center reveal">
        <Icon
          icon="lucide:mail-open"
          width={32}
          className="mb-6 text-neutral-400 mx-auto"
        />
        <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter mb-4">
          Join the list
        </h2>
        <p className="text-neutral-400 mb-10 max-w-md mx-auto text-sm">
          Sign up for early access to new drops and exclusive offers. No spam,
          ever.
        </p>

        {submitted ? (
          <p className="text-sm font-semibold text-neutral-300">
            Thanks for subscribing! We&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="bg-white text-neutral-900 text-sm font-bold px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
