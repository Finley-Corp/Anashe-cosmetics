"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { useQuickView } from '@/components/ui/QuickViewModal';
import { cn } from '@/lib/utils';

export const PRODUCT_CATALOG = [
  { id: "vt_reedle", brand: "VT Cosmetics", name: "Reedle Shot 300", desc: "Cellular renewal with 237,500 Cica Reedles.", price: 52448, oldPrice: null, stars: 5, reviews: 312, badge: "Best Seller", badgeClass: "text-[#212322] bg-[#ECBAA8]", filter: ["oleosa", "todas"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/cuidados-facial-luno.ao.jpg/w=600,q=80" },
  { id: "anua_cleanser", brand: "Anua", name: "Heartleaf BHA Deep Cleansing Foam", desc: "Deep pore cleansing with BHA.", price: 27355, oldPrice: null, stars: 5, reviews: 248, badge: "New", badgeClass: "text-[#212322] bg-[#B5E3D8]", filter: ["oleosa", "limpeza"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/limpeza-facial.jpg/w=600,q=80" },
  { id: "ksecret_seoul1988", brand: "K-SECRET", name: "Seoul 1988 Cream Snail Mucin", desc: "Regeneration with 93% snail mucin.", price: 28499, oldPrice: 33922, stars: 5, reviews: 521, badge: "−15%", badgeClass: "text-[#212322] bg-[#F1BDC8]", filter: ["seca", "sensivel"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/cuidados-facial-luno.ao.jpg/w=600,q=80" },
  { id: "beauty_joseon_sun", brand: "Beauty of Joseon", name: "Relief Sun Aqua Fresh SPF50+", desc: "Watery texture for hot climates.", price: 30779, oldPrice: null, stars: 5, reviews: 186, badge: "Best Seller", badgeClass: "text-[#212322] bg-[#ECBAA8]", filter: ["solar", "todas"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/protetor-solar-luno.ao.jpg/w=600,q=80" },
  { id: "skin1004_centella", brand: "SKIN1004", name: "Madagascar Centella Capsule", desc: "Pure Centella. Calming and repairing.", price: 23940, oldPrice: null, stars: 4, reviews: 189, badge: "New", badgeClass: "text-[#212322] bg-[#B5E3D8]", filter: ["sensivel", "mista"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/cuidados-facial-luno.ao.jpg/w=600,q=80" },
  { id: "purito_centella", brand: "Purito Seoul", name: "Wonder Releaf Centella Cream", desc: "Strengthened skin barrier.", price: 25075, oldPrice: null, stars: 5, reviews: 412, badge: "Best Seller", badgeClass: "text-[#212322] bg-[#ECBAA8]", filter: ["sensivel", "seca"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/marcaras-faciais.jpg/w=600,q=80" },
  { id: "apricot_peeling", brand: "SOME BY MI", name: "Apricot Blossom Peeling Gel", desc: "Gentle enzymatic exfoliant.", price: 21660, oldPrice: null, stars: 4, reviews: 97, badge: "New", badgeClass: "text-[#212322] bg-[#B5E3D8]", filter: ["oleosa", "todas"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/limpeza-facial.jpg/w=600,q=80" },
  { id: "abib_eye", brand: "Abib", name: "Collagen Eye Patch Jericho Rose", desc: "Eye contour with collagen.", price: 35347, oldPrice: null, stars: 5, reviews: 143, badge: "Best Seller", badgeClass: "text-[#212322] bg-[#ECBAA8]", filter: ["todas"], img: "https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/marcaras-faciais.jpg/w=600,q=80" }
];

export const ProductsGrid = () => {
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openQuickView } = useQuickView();

  const filteredProducts = PRODUCT_CATALOG.filter(p => 
    filter === 'all' || p.filter.includes(filter)
  );

  return (
    <section className="py-24 px-8 lg:px-20 bg-[#1a1b1a] relative border-y border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-anashe-lila font-normal mb-3">
              <Icon icon="solar:stars-linear" /> Best Sellers
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight text-anashe-fg">
              Favorites of the<br /><em className="text-anashe-peach not-italic">Anashe community</em>
            </h2>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { id: 'all', label: 'All' },
            { id: 'oleosa', label: 'Oily Skin' },
            { id: 'seca', label: 'Dry Skin' },
            { id: 'sensivel', label: 'Sensitive' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-5 py-2 rounded-full text-xs tracking-widest uppercase font-normal border transition-colors",
                filter === f.id 
                  ? "bg-anashe-lila text-anashe-bg border-anashe-lila" 
                  : "border-white/20 text-anashe-fg/50 hover:border-white/50 hover:text-anashe-fg"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => openQuickView(p)}
                className="group bg-[#252726]/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:border-anashe-lila/30 hover:bg-[#252726] hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-[#1a1b1a] flex items-center justify-center">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className={cn("absolute top-3 left-3 text-[9px] font-normal tracking-widest uppercase px-2 py-1 rounded-sm z-10", p.badgeClass)}>
                    {p.badge}
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-anashe-bg/60 border border-white/10 text-anashe-fg/70 flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-anashe-pink/20 hover:text-anashe-pink hover:border-anashe-pink transition-all z-10">
                    <Icon icon="solar:heart-linear" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[9px] tracking-widest uppercase text-anashe-lila font-normal mb-1">{p.brand}</div>
                  <div className="text-sm font-light text-anashe-fg mb-1 leading-snug line-clamp-1">{p.name}</div>
                  <div className="text-[11px] text-anashe-fg/40 mb-3 font-extralight line-clamp-1">{p.desc}</div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <div className="text-anashe-peach text-[10px] flex items-center tracking-widest">★★★★★</div>
                    <span className="text-[10px] text-anashe-fg/40">({p.reviews})</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      {p.oldPrice && <div className="text-[10px] text-anashe-fg/30 line-through">{p.oldPrice.toLocaleString('pt-PT')}</div>}
                      <div className="text-base font-light text-anashe-fg">
                        {p.price.toLocaleString('pt-PT')} <span className="text-[10px] text-anashe-fg/40">Kz</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                        showToast(`"${p.name.substring(0, 20)}..." added`);
                      }}
                      className="w-8 h-8 rounded-full bg-anashe-fg text-anashe-bg flex items-center justify-center hover:bg-anashe-lila hover:scale-110 transition-all duration-300"
                    >
                      <Icon icon="solar:add-circle-linear" width="1.2em" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
