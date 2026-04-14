#!/usr/bin/env node
/**
 * Anashe Skincare & Cosmetics — Database Seeder
 *
 * Prerequisites: Run 001_initial_schema.sql + 002_rls_policies.sql in Supabase SQL Editor FIRST.
 * Then run: node scripts/seed-db.mjs
 *
 * Uses the service role key (bypasses RLS) to insert categories, products, and coupons.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env.local
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
    .filter(([k]) => k)
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function upsert(table, rows, label, onConflict) {
  process.stdout.write(`  ${label} ... `);
  const { error } = await supabase.from(table).upsert(rows, { onConflict, ignoreDuplicates: false });
  if (error) {
    console.log(`\n  ⚠  ${error.message}`);
    return false;
  }
  console.log(`✓ (${rows.length})`);
  return true;
}

async function insertRows(table, rows, label) {
  process.stdout.write(`  ${label} ... `);
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.log(`\n  ⚠  ${error.message}`);
    return false;
  }
  console.log(`✓ (${rows.length})`);
  return true;
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

const categories = [
  { id: 'cat-01', name: 'Moisturisers & Hydration', slug: 'moisturisers', description: 'Day & night creams, hydrating lotions, face mists', sort_order: 1, is_active: true },
  { id: 'cat-02', name: 'Serums & Treatments',       slug: 'serums-treatments', description: 'Vitamin C, retinol, niacinamide, hyaluronic acid serums', sort_order: 2, is_active: true },
  { id: 'cat-03', name: 'Cleansers & Toners',        slug: 'cleansers-toners', description: 'Foaming cleansers, micellar water, AHA/BHA toners', sort_order: 3, is_active: true },
  { id: 'cat-04', name: 'Sunscreen & SPF',            slug: 'sunscreen-spf', description: 'SPF 30–50+ daily sunscreens, tinted SPF', sort_order: 4, is_active: true },
  { id: 'cat-05', name: 'Eye & Lip Care',             slug: 'eye-lip-care', description: 'Eye creams, lip balms, lip masks, dark circles', sort_order: 5, is_active: true },
  { id: 'cat-06', name: 'Foundations & Concealer',   slug: 'foundations-concealer', description: 'Liquid & powder foundations, concealers', sort_order: 6, is_active: true },
  { id: 'cat-07', name: 'Blush, Bronzer & Highlighter', slug: 'blush-bronzer-highlighter', description: 'Powder and cream blush, bronzers, highlighters', sort_order: 7, is_active: true },
  { id: 'cat-08', name: 'Lipstick & Lip Gloss',      slug: 'lipstick-lip-gloss', description: 'Matte/satin/glossy lips, lip liners', sort_order: 8, is_active: true },
  { id: 'cat-09', name: 'Mascaras & Eye Makeup',     slug: 'mascaras-eye-makeup', description: 'Mascaras, eyeliners, eyeshadow palettes', sort_order: 9, is_active: true },
  { id: 'cat-10', name: 'Nail Care',                  slug: 'nail-care', description: 'Nail polishes, treatments, tools', sort_order: 10, is_active: true },
  { id: 'cat-11', name: 'Body & Bath',                slug: 'body-bath', description: 'Body lotions, scrubs, shower gels', sort_order: 11, is_active: true },
  { id: 'cat-12', name: 'Hair Care',                  slug: 'hair-care', description: 'Shampoos, conditioners, hair oils, treatments', sort_order: 12, is_active: true },
  { id: 'cat-13', name: 'Tools & Accessories',        slug: 'tools-accessories', description: 'Facial rollers, gua sha, brushes, applicators', sort_order: 13, is_active: true },
  { id: 'cat-14', name: 'Natural & Organic',          slug: 'natural-organic', description: 'Clean beauty, natural formulations', sort_order: 14, is_active: true },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

const products = [
  // ── SERUMS & TREATMENTS ──────────────────────────────────────────────────
  {
    id: 'prod-001', name: 'Vitamin C Brightening Serum 30ml', slug: 'vitamin-c-brightening-serum-30ml',
    brand: 'The Ordinary', category_id: 'cat-02', price: 2800, sale_price: 2200,
    stock: 45, sku: 'TO-VCS-30', volume_ml: 30,
    skin_type: ['oily', 'combination', 'all'], concerns: ['hyperpigmentation', 'brightening', 'anti-aging'],
    ingredients: 'Aqua, Ascorbic Acid 15%, Niacinamide 5%, Ferulic Acid, Panthenol, Glycerin, Sodium Hyaluronate',
    short_description: 'High-strength vitamin C serum that brightens, evens skin tone and fights hyperpigmentation.',
    is_vegan: true, is_cruelty_free: true, is_published: true, is_featured: true,
    meta_title: 'Vitamin C Brightening Serum 30ml | Anashe', tags: ['vitamin-c', 'brightening', 'serum'],
    meta_description: 'Shop Vitamin C Brightening Serum 30ml by The Ordinary. Best for oily & combination skin. Targets hyperpigmentation. KES 2,800 — Pay via M-Pesa.',
  },
  {
    id: 'prod-002', name: 'Hyaluronic Acid Hydrating Serum 30ml', slug: 'hyaluronic-acid-hydrating-serum-30ml',
    brand: 'The Ordinary', category_id: 'cat-02', price: 1900,
    stock: 60, sku: 'TO-HA-30', volume_ml: 30,
    skin_type: ['dry', 'combination', 'sensitive', 'all'], concerns: ['hydration'],
    ingredients: 'Aqua, Sodium Hyaluronate 2%, Sodium Hyaluronate Crosspolymer, Pentylene Glycol, Glycerin, Allantoin',
    short_description: 'Multi-depth hydration serum with low, medium and high molecular weight hyaluronic acid.',
    is_vegan: true, is_cruelty_free: true, is_published: true, is_featured: true,
    tags: ['hyaluronic-acid', 'hydration', 'serum'],
    meta_description: 'Shop Hyaluronic Acid Serum 30ml. Best for dry and sensitive skin. Intense hydration. KES 1,900 — Pay via M-Pesa Kenya.',
  },
  {
    id: 'prod-003', name: 'Retinol 0.5% Night Repair Serum 30ml', slug: 'retinol-05-night-repair-serum-30ml',
    brand: 'The Inkey List', category_id: 'cat-02', price: 3200,
    stock: 30, sku: 'TIL-RET-30', volume_ml: 30,
    skin_type: ['oily', 'combination', 'dry'], concerns: ['anti-aging', 'pores', 'hyperpigmentation'],
    ingredients: 'Aqua, Retinol 0.5%, Squalane, Tocopheryl Acetate, Panthenol, Niacinamide 1%',
    short_description: 'Overnight retinol serum that smooths fine lines, refines pores and improves skin texture.',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['retinol', 'anti-aging', 'serum'],
    meta_description: 'Shop Retinol 0.5% Night Serum 30ml. Anti-aging serum for fine lines and pores. KES 3,200 — Pay via M-Pesa.',
  },
  {
    id: 'prod-004', name: 'Niacinamide 10% + Zinc 1% Serum 30ml', slug: 'niacinamide-10-zinc-1-serum-30ml',
    brand: 'The Ordinary', category_id: 'cat-02', price: 1500,
    stock: 80, sku: 'TO-NZ-30', volume_ml: 30,
    skin_type: ['oily', 'combination'], concerns: ['acne', 'pores', 'brightening'],
    ingredients: 'Aqua, Niacinamide 10%, Zinc PCA 1%, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol',
    short_description: 'High-strength niacinamide serum that minimises pores, controls oil and brightens skin.',
    is_vegan: true, is_cruelty_free: true, is_published: true, is_featured: true,
    tags: ['niacinamide', 'acne', 'pores', 'serum'],
    meta_description: 'Shop Niacinamide 10% + Zinc Serum 30ml. Best for oily skin. Controls oil, minimises pores. KES 1,500 — Pay via M-Pesa Kenya.',
  },
  {
    id: 'prod-005', name: 'Ceramide Barrier Repair Serum 30ml', slug: 'ceramide-barrier-repair-serum-30ml',
    brand: 'CeraVe', category_id: 'cat-02', price: 3500,
    stock: 25, sku: 'CV-CBS-30', volume_ml: 30,
    skin_type: ['dry', 'sensitive', 'combination'], concerns: ['hydration', 'redness', 'sensitivity'],
    ingredients: 'Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Niacinamide 3%, Sodium Hyaluronate, Phytosphingosine',
    short_description: 'Ceramide-rich serum that repairs and strengthens the skin barrier.',
    is_vegan: true, is_cruelty_free: false, is_published: true,
    tags: ['ceramide', 'barrier', 'sensitive', 'serum'],
  },
  {
    id: 'prod-006', name: 'Salicylic Acid 2% Spot Treatment 30ml', slug: 'salicylic-acid-2-spot-treatment-30ml',
    brand: 'Paula\'s Choice', category_id: 'cat-02', price: 2100,
    stock: 40, sku: 'PC-SA-30', volume_ml: 30,
    skin_type: ['oily', 'combination'], concerns: ['acne', 'pores', 'brightening'],
    ingredients: 'Water, Salicylic Acid 2%, Butylene Glycol, Panthenol, Niacinamide, Green Tea Extract, Allantoin',
    short_description: 'Targeted salicylic acid treatment that clears breakouts and unclogs pores.',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['salicylic-acid', 'acne', 'bha', 'spot-treatment'],
  },

  // ── CLEANSERS & TONERS ───────────────────────────────────────────────────
  {
    id: 'prod-007', name: 'Gentle Foaming Cleanser 150ml', slug: 'gentle-foaming-cleanser-150ml',
    brand: 'CeraVe', category_id: 'cat-03', price: 950,
    stock: 100, sku: 'CV-GFC-150', volume_ml: 150,
    skin_type: ['oily', 'combination', 'all'], concerns: ['acne', 'pores'],
    ingredients: 'Aqua, Glycerin, Hyaluronic Acid, Niacinamide 2%, Ceramide NP, Phenoxyethanol, Sodium Lauroyl Sarcosinate',
    short_description: 'Soap-free foaming cleanser with hyaluronic acid and ceramides.',
    is_vegan: true, is_cruelty_free: false, is_published: true,
    tags: ['cleanser', 'foaming', 'ceramide'],
  },
  {
    id: 'prod-008', name: 'Micellar Cleansing Water 250ml', slug: 'micellar-cleansing-water-250ml',
    brand: 'Bioderma', category_id: 'cat-03', price: 1200,
    stock: 70, sku: 'BD-MCW-250', volume_ml: 250,
    skin_type: ['sensitive', 'dry', 'all'], concerns: ['sensitivity', 'hydration'],
    ingredients: 'Aqua, Cucurbit Fruit Extract, PEG-6 Caprylic/Capric Glycerides, Sodium Chloride, Disodium EDTA',
    short_description: 'Gentle micellar water that removes makeup and impurities without rinsing.',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['micellar-water', 'makeup-remover', 'sensitive'],
  },
  {
    id: 'prod-009', name: 'AHA 30% + BHA 2% Peeling Solution 30ml', slug: 'aha-30-bha-2-peeling-solution-30ml',
    brand: 'The Ordinary', category_id: 'cat-03', price: 2100,
    stock: 35, sku: 'TO-AHA-30', volume_ml: 30,
    skin_type: ['oily', 'combination'], concerns: ['acne', 'hyperpigmentation', 'pores', 'brightening'],
    ingredients: 'Glycolic Acid 30%, Salicylic Acid 2%, Tartaric Acid, Citric Acid, Sodium Hydroxide, Dextrin',
    short_description: 'High-strength exfoliating solution with glycolic and salicylic acid for brighter, smoother skin.',
    is_vegan: true, is_cruelty_free: true, is_published: true, is_featured: true,
    tags: ['aha', 'bha', 'exfoliant', 'peeling'],
  },
  {
    id: 'prod-010', name: 'Balancing AHA Toner 200ml', slug: 'balancing-aha-toner-200ml',
    brand: 'Pixi', category_id: 'cat-03', price: 2400,
    stock: 50, sku: 'PX-AT-200', volume_ml: 200,
    skin_type: ['oily', 'combination', 'dry'], concerns: ['brightening', 'pores', 'anti-aging'],
    ingredients: 'Aqua, Glycolic Acid 5%, Aloe Barbadensis Leaf Juice, Ginseng Root Extract, Witch Hazel Water, Niacinamide',
    short_description: 'Exfoliating glycolic acid toner that brightens, smooths and balances skin.',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['toner', 'glycolic-acid', 'brightening'],
  },

  // ── MOISTURISERS & HYDRATION ────────────────────────────────────────────
  {
    id: 'prod-011', name: 'Oil-Free Gel Moisturiser 60ml', slug: 'oil-free-gel-moisturiser-60ml',
    brand: 'Neutrogena', category_id: 'cat-01', price: 1350,
    stock: 65, sku: 'NG-OFG-60', volume_ml: 60,
    skin_type: ['oily', 'combination'], concerns: ['hydration', 'acne', 'pores'],
    ingredients: 'Aqua, Glycerin, Dimethicone, Hyaluronic Acid, Niacinamide 2%, Panthenol, Phenoxyethanol',
    short_description: 'Lightweight oil-free gel moisturiser that hydrates without clogging pores.',
    is_vegan: true, is_cruelty_free: false, is_published: true, is_featured: true,
    tags: ['moisturiser', 'oil-free', 'gel', 'hydration'],
  },
  {
    id: 'prod-012', name: 'Deep Moisture Night Cream 50ml', slug: 'deep-moisture-night-cream-50ml',
    brand: 'Olay', category_id: 'cat-01', price: 2200,
    stock: 40, sku: 'OL-DMN-50', volume_ml: 50,
    skin_type: ['dry', 'combination', 'sensitive'], concerns: ['hydration', 'anti-aging'],
    ingredients: 'Aqua, Niacinamide 5%, Glycerin, Shea Butter, Ceramide NP, Retinyl Propionate, Sodium Hyaluronate',
    short_description: 'Rich overnight cream that replenishes moisture and reduces fine lines while you sleep.',
    is_published: true,
    tags: ['night-cream', 'anti-aging', 'moisturiser'],
  },
  {
    id: 'prod-013', name: 'Rich Shea Butter Moisturiser 100ml', slug: 'rich-shea-butter-moisturiser-100ml',
    brand: 'Nivea', category_id: 'cat-01', price: 900,
    stock: 90, sku: 'NV-SBM-100', volume_ml: 100,
    skin_type: ['dry', 'sensitive'], concerns: ['hydration', 'sensitivity'],
    ingredients: 'Aqua, Shea Butter (Butyrospermum Parkii), Glycerin, Dimethicone, Allantoin, Panthenol',
    short_description: 'Deeply nourishing shea butter moisturiser for very dry and sensitive skin.',
    is_vegan: false, is_natural: true, is_published: true,
    tags: ['shea-butter', 'moisturiser', 'dry-skin'],
  },
  {
    id: 'prod-014', name: 'Collagen Boosting Face Cream 50ml', slug: 'collagen-boosting-face-cream-50ml',
    brand: 'Pond\'s', category_id: 'cat-01', price: 1750,
    stock: 55, sku: 'PD-CBF-50', volume_ml: 50,
    skin_type: ['dry', 'combination', 'all'], concerns: ['anti-aging', 'hydration'],
    ingredients: 'Aqua, Hydrolysed Collagen, Glycerin, Niacinamide, Panthenol, Dimethicone, Tocopheryl Acetate',
    short_description: 'Lightweight face cream with hydrolysed collagen that firms and hydrates skin.',
    is_published: true, is_featured: true,
    tags: ['collagen', 'moisturiser', 'anti-aging'],
  },
  {
    id: 'prod-015', name: 'Green Tea Antioxidant Face Mist 100ml', slug: 'green-tea-antioxidant-face-mist-100ml',
    brand: 'Innisfree', category_id: 'cat-01', price: 1100,
    stock: 45, sku: 'IF-GTM-100', volume_ml: 100,
    skin_type: ['oily', 'combination', 'sensitive', 'all'], concerns: ['brightening', 'hydration', 'redness'],
    ingredients: 'Camellia Sinensis Leaf Water, Glycerin, Hyaluronic Acid, Green Tea Extract, Panthenol, Centella Asiatica',
    short_description: 'Refreshing antioxidant mist with green tea that hydrates and soothes throughout the day.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['face-mist', 'green-tea', 'antioxidant', 'hydration'],
  },

  // ── SUNSCREEN & SPF ──────────────────────────────────────────────────────
  {
    id: 'prod-016', name: 'SPF 50+ Daily Moisturising Sunscreen 50ml', slug: 'spf-50-daily-moisturising-sunscreen-50ml',
    brand: 'La Roche-Posay', category_id: 'cat-04', price: 3200, sale_price: 2800,
    stock: 55, sku: 'LRP-SPF50-50', volume_ml: 50, spf: 50,
    skin_type: ['oily', 'combination', 'sensitive', 'all'], concerns: ['anti-aging', 'hyperpigmentation'],
    ingredients: 'Aqua, Mexoryl SX, Mexoryl XL, Tinosorb S, Niacinamide 2%, Glycerin, Dimethicone, Thermal Spring Water',
    short_description: 'Lightweight SPF 50+ broad-spectrum sunscreen with niacinamide. Dermatologist tested.',
    is_vegan: true, is_cruelty_free: true, finish: 'natural', is_published: true, is_featured: true,
    tags: ['sunscreen', 'spf50', 'uv-protection', 'daily'],
    meta_description: 'SPF 50+ Daily Sunscreen 50ml by La Roche-Posay. Lightweight, for all skin types in Kenya. KES 3,200 — Pay via M-Pesa.',
  },
  {
    id: 'prod-017', name: 'Tinted SPF 30 BB Cream 40ml', slug: 'tinted-spf-30-bb-cream-40ml',
    brand: 'Garnier', category_id: 'cat-04', price: 1600,
    stock: 70, sku: 'GN-BB30-40', volume_ml: 40, spf: 30,
    skin_type: ['oily', 'combination', 'all'], concerns: ['brightening', 'hyperpigmentation'],
    ingredients: 'Aqua, Titanium Dioxide, Zinc Oxide, Glycerin, Niacinamide, Aloe Vera Extract, Dimethicone',
    short_description: 'Tinted BB cream with SPF 30 that evens skin tone and protects from UV rays.',
    is_published: true, finish: 'natural', shade: 'Medium', shade_hex: '#C4956A',
    tags: ['bb-cream', 'tinted', 'spf30', 'sunscreen'],
  },
  {
    id: 'prod-018', name: 'Invisible SPF 50 Gel Sunscreen 50ml', slug: 'invisible-spf-50-gel-sunscreen-50ml',
    brand: 'Bondi Sands', category_id: 'cat-04', price: 2400,
    stock: 40, sku: 'BS-SPF50G-50', volume_ml: 50, spf: 50,
    skin_type: ['oily', 'combination'], concerns: ['anti-aging'],
    ingredients: 'Aqua, Octinoxate, Avobenzone, Glycerin, Panthenol, Aloe Vera Leaf Juice, Hyaluronic Acid',
    short_description: 'Ultra-light gel formula SPF 50 that leaves no white cast. Perfect for daily use.',
    is_vegan: true, is_cruelty_free: true, finish: 'dewy', is_published: true,
    tags: ['sunscreen', 'spf50', 'gel', 'invisible'],
  },
  {
    id: 'prod-019', name: 'Mineral SPF 30 Tinted Sunscreen 40ml', slug: 'mineral-spf-30-tinted-sunscreen-40ml',
    brand: 'EltaMD', category_id: 'cat-04', price: 4200,
    stock: 20, sku: 'EM-MSP30-40', volume_ml: 40, spf: 30,
    skin_type: ['sensitive', 'dry', 'combination'], concerns: ['redness', 'sensitivity', 'anti-aging'],
    ingredients: 'Zinc Oxide 9%, Titanium Dioxide 7.5%, Niacinamide, Hyaluronic Acid, Lactic Acid, Sodium Hyaluronate',
    short_description: '100% mineral broad-spectrum SPF 30 tinted sunscreen, dermatologist recommended.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['mineral', 'sunscreen', 'tinted', 'sensitive-skin'],
  },

  // ── EYE & LIP CARE ──────────────────────────────────────────────────────
  {
    id: 'prod-020', name: 'Brightening Eye Contour Cream 15ml', slug: 'brightening-eye-contour-cream-15ml',
    brand: 'Kiehl\'s', category_id: 'cat-05', price: 4500,
    stock: 20, sku: 'KH-ECC-15', volume_ml: 15,
    skin_type: ['all'], concerns: ['dark-circles', 'anti-aging', 'puffiness'],
    ingredients: 'Aqua, Caffeine 5%, Niacinamide, Vitamin C 3%, Hyaluronic Acid, Peptides, Ceramide NP',
    short_description: 'Caffeine-powered eye cream that visibly reduces dark circles and puffiness.',
    is_vegan: true, is_cruelty_free: false, is_published: true, is_featured: true,
    tags: ['eye-cream', 'dark-circles', 'caffeine'],
  },
  {
    id: 'prod-021', name: 'Overnight Lip Mask & Treatment 15ml', slug: 'overnight-lip-mask-treatment-15ml',
    brand: 'Laneige', category_id: 'cat-05', price: 2200,
    stock: 50, sku: 'LG-LM-15', volume_ml: 15,
    skin_type: ['all'], concerns: ['hydration'],
    ingredients: 'Water Berry Complex, Hyaluronic Acid, Vitamin C, Seaberry Extract, Mango Seed Butter, Shea Butter',
    short_description: 'Intensely hydrating overnight lip mask that restores soft, smooth lips by morning.',
    is_vegan: false, is_cruelty_free: false, is_published: true,
    tags: ['lip-mask', 'hydration', 'overnight'],
  },

  // ── FOUNDATIONS & CONCEALER ──────────────────────────────────────────────
  {
    id: 'prod-022', name: 'Skin Glow Liquid Foundation 30ml — Warm Ivory', slug: 'skin-glow-liquid-foundation-warm-ivory',
    brand: 'Fenty Beauty', category_id: 'cat-06', price: 5500,
    stock: 30, sku: 'FB-SGF-WI', volume_ml: 30,
    skin_type: ['dry', 'combination', 'all'], concerns: ['hydration'],
    ingredients: 'Aqua, Cyclopentasiloxane, Glycerin, Niacinamide, Dimethicone, Titanium Dioxide, Iron Oxides',
    short_description: 'Buildable coverage liquid foundation with a natural skin-like finish. 40-shade range.',
    finish: 'dewy', shade: 'Warm Ivory', shade_hex: '#EEDAD4',
    is_vegan: true, is_cruelty_free: true, is_published: true, is_featured: true,
    tags: ['foundation', 'liquid', 'dewy', 'buildable'],
  },
  {
    id: 'prod-023', name: 'Skin Glow Liquid Foundation 30ml — Natural Beige', slug: 'skin-glow-liquid-foundation-natural-beige',
    brand: 'Fenty Beauty', category_id: 'cat-06', price: 5500,
    stock: 35, sku: 'FB-SGF-NB', volume_ml: 30,
    skin_type: ['dry', 'combination', 'oily', 'all'], concerns: ['hydration'],
    ingredients: 'Aqua, Cyclopentasiloxane, Glycerin, Niacinamide, Dimethicone, Titanium Dioxide, Iron Oxides',
    short_description: 'Buildable coverage liquid foundation with a natural skin-like finish.',
    finish: 'dewy', shade: 'Natural Beige', shade_hex: '#C4956A',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['foundation', 'liquid', 'buildable'],
  },
  {
    id: 'prod-024', name: 'Full Coverage Concealer 6ml — Fair', slug: 'full-coverage-concealer-fair',
    brand: 'Charlotte Tilbury', category_id: 'cat-06', price: 3800,
    stock: 40, sku: 'CT-FCC-FAIR', volume_ml: 6,
    skin_type: ['all'], concerns: ['dark-circles', 'hyperpigmentation'],
    ingredients: 'Aqua, Dimethicone, Talc, Glycerin, Niacinamide, Titanium Dioxide, Iron Oxides',
    short_description: 'Full-coverage creamy concealer that hides dark circles and blemishes.',
    finish: 'satin', shade: 'Fair', shade_hex: '#F2E0CA',
    is_vegan: false, is_cruelty_free: false, is_published: true,
    tags: ['concealer', 'full-coverage', 'dark-circles'],
  },
  {
    id: 'prod-025', name: 'Full Coverage Concealer 6ml — Medium', slug: 'full-coverage-concealer-medium',
    brand: 'Charlotte Tilbury', category_id: 'cat-06', price: 3800,
    stock: 35, sku: 'CT-FCC-MED', volume_ml: 6,
    skin_type: ['all'], concerns: ['dark-circles', 'hyperpigmentation'],
    ingredients: 'Aqua, Dimethicone, Talc, Glycerin, Niacinamide, Titanium Dioxide, Iron Oxides',
    short_description: 'Full-coverage creamy concealer — Medium shade.',
    finish: 'satin', shade: 'Medium', shade_hex: '#C49A6C',
    is_vegan: false, is_cruelty_free: false, is_published: true,
    tags: ['concealer', 'full-coverage'],
  },

  // ── BLUSH, BRONZER & HIGHLIGHTER ────────────────────────────────────────
  {
    id: 'prod-026', name: 'Powder Blush — Coral Kiss', slug: 'powder-blush-coral-kiss',
    brand: 'MAC', category_id: 'cat-07', price: 2800,
    stock: 45, sku: 'MAC-PB-CK',
    skin_type: ['all'], concerns: [],
    ingredients: 'Talc, Mica, Magnesium Stearate, Kaolin, Iron Oxides, Ultramarines',
    short_description: 'Silky powder blush with a natural matte finish. Shade: Coral Kiss.',
    finish: 'matte', shade: 'Coral Kiss', shade_hex: '#E8725A',
    is_vegan: true, is_cruelty_free: false, is_published: true,
    tags: ['blush', 'powder', 'coral'],
  },
  {
    id: 'prod-027', name: 'Highlighter — Golden Hour', slug: 'highlighter-golden-hour',
    brand: 'Charlotte Tilbury', category_id: 'cat-07', price: 4200,
    stock: 25, sku: 'CT-HL-GH',
    skin_type: ['all'], concerns: [],
    ingredients: 'Mica, Talc, Silica, Nylon-12, Tocopheryl Acetate, Titanium Dioxide, Iron Oxides',
    short_description: 'Luminous powder highlighter that gives a blinding golden glow.',
    finish: 'glossy', shade: 'Golden Hour', shade_hex: '#F5D78E',
    is_vegan: false, is_cruelty_free: false, is_published: true, is_featured: true,
    tags: ['highlighter', 'glow', 'gold'],
  },
  {
    id: 'prod-028', name: 'Sun Kissed Bronzer', slug: 'sun-kissed-bronzer',
    brand: 'Too Faced', category_id: 'cat-07', price: 3500,
    stock: 30, sku: 'TF-SKB',
    skin_type: ['all'], concerns: [],
    ingredients: 'Talc, Mica, Boron Nitride, Magnesium Stearate, Dimethicone, Iron Oxides',
    short_description: 'Natural-looking matte bronzer that gives a sun-kissed glow.',
    finish: 'matte', shade: 'Sun Kissed', shade_hex: '#A0714F',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['bronzer', 'matte', 'contour'],
  },

  // ── LIPSTICK & LIP GLOSS ────────────────────────────────────────────────
  {
    id: 'prod-029', name: 'Matte Lipstick — Classic Red', slug: 'matte-lipstick-classic-red',
    brand: 'MAC', category_id: 'cat-08', price: 2500,
    stock: 60, sku: 'MAC-ML-CR',
    skin_type: ['all'], concerns: [],
    ingredients: 'Ricinus Communis Seed Oil, Candelilla Cera, Shea Butter, Vitamin E, Iron Oxides',
    short_description: 'Iconic matte lipstick with rich, buildable colour and long-lasting wear.',
    finish: 'matte', shade: 'Classic Red', shade_hex: '#C0392B',
    is_vegan: true, is_cruelty_free: false, is_published: true, is_featured: true,
    tags: ['lipstick', 'matte', 'red'],
  },
  {
    id: 'prod-030', name: 'Matte Lipstick — Nude Mauve', slug: 'matte-lipstick-nude-mauve',
    brand: 'MAC', category_id: 'cat-08', price: 2500,
    stock: 55, sku: 'MAC-ML-NM',
    skin_type: ['all'], concerns: [],
    ingredients: 'Ricinus Communis Seed Oil, Candelilla Cera, Shea Butter, Vitamin E, Iron Oxides',
    short_description: 'Everyday matte nude lipstick — flattering on all skin tones.',
    finish: 'matte', shade: 'Nude Mauve', shade_hex: '#C4956A',
    is_vegan: true, is_cruelty_free: false, is_published: true,
    tags: ['lipstick', 'matte', 'nude'],
  },
  {
    id: 'prod-031', name: 'Glossy Lip Gloss — Rose Gold', slug: 'glossy-lip-gloss-rose-gold',
    brand: 'Fenty Beauty', category_id: 'cat-08', price: 1800,
    stock: 65, sku: 'FB-LG-RG',
    skin_type: ['all'], concerns: [],
    ingredients: 'Polybutene, Ricinus Communis Seed Oil, Lanolin, Vitamin E, Mica, Iron Oxides',
    short_description: 'High-shine lip gloss with a rose gold shimmer finish.',
    finish: 'glossy', shade: 'Rose Gold', shade_hex: '#E8B4B8',
    is_vegan: false, is_cruelty_free: true, is_published: true,
    tags: ['lip-gloss', 'glossy', 'shimmer'],
  },
  {
    id: 'prod-032', name: 'Matte Liquid Lip — Berry Plum', slug: 'matte-liquid-lip-berry-plum',
    brand: 'NYX', category_id: 'cat-08', price: 1200,
    stock: 50, sku: 'NYX-MLL-BP',
    skin_type: ['all'], concerns: [],
    ingredients: 'Aqua, Isododecane, Dimethicone, Cyclopentasiloxane, Acrylates Copolymer, Iron Oxides',
    short_description: 'Long-wearing matte liquid lipstick in deep berry plum.',
    finish: 'matte', shade: 'Berry Plum', shade_hex: '#7D3C98',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['liquid-lipstick', 'matte', 'plum'],
  },

  // ── MASCARAS & EYE MAKEUP ────────────────────────────────────────────────
  {
    id: 'prod-033', name: 'Volumising Black Mascara', slug: 'volumising-black-mascara',
    brand: 'L\'Oréal', category_id: 'cat-09', price: 1400,
    stock: 80, sku: 'LO-VBM',
    skin_type: ['all'], concerns: [],
    ingredients: 'Aqua, Beeswax, Carnauba Wax, Iron Oxides, Panthenol, Vitamin E',
    short_description: 'Lash-volumising mascara that adds 5x volume without clumping.',
    shade: 'Noir Black', shade_hex: '#1A1A1A',
    is_cruelty_free: false, is_published: true, is_featured: true,
    tags: ['mascara', 'volumising', 'black'],
  },
  {
    id: 'prod-034', name: 'Nude Eyeshadow Palette — 9 Pan', slug: 'nude-eyeshadow-palette-9-pan',
    brand: 'Urban Decay', category_id: 'cat-09', price: 4800,
    stock: 20, sku: 'UD-NEP9',
    skin_type: ['all'], concerns: [],
    ingredients: 'Mica, Talc, Magnesium Stearate, Dimethicone, Iron Oxides, Carmine',
    short_description: '9 universally flattering nude and warm eyeshadow shades in a range of finishes.',
    is_vegan: false, is_cruelty_free: true, is_published: true,
    tags: ['eyeshadow', 'palette', 'nude'],
  },
  {
    id: 'prod-035', name: 'Brown Precision Eyeliner', slug: 'brown-precision-eyeliner',
    brand: 'NYX', category_id: 'cat-09', price: 800,
    stock: 70, sku: 'NYX-BPE',
    skin_type: ['all'], concerns: [],
    ingredients: 'Hydrogenated Vegetable Oil, Ozokerite, Beeswax, Vitamin E, Iron Oxides',
    short_description: 'Long-wearing brown eyeliner pencil with built-in sharpener.',
    shade: 'Rich Brown', shade_hex: '#6B3E2E',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['eyeliner', 'pencil', 'brown'],
  },

  // ── NAIL CARE ────────────────────────────────────────────────────────────
  {
    id: 'prod-036', name: 'Long-Wear Nail Polish — Coral Crush', slug: 'long-wear-nail-polish-coral-crush',
    brand: 'OPI', category_id: 'cat-10', price: 650,
    stock: 100, sku: 'OPI-NP-CC',
    skin_type: [], concerns: [],
    ingredients: 'Ethyl Acetate, Butyl Acetate, Nitrocellulose, Tosylamide/Formaldehyde Resin, Isopropyl Alcohol',
    short_description: 'Chip-resistant nail polish with 7-free formula. Shade: Coral Crush.',
    shade: 'Coral Crush', shade_hex: '#FF6B6B',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['nail-polish', 'coral', 'long-wear'],
  },
  {
    id: 'prod-037', name: 'Long-Wear Nail Polish — Classic Red', slug: 'long-wear-nail-polish-classic-red',
    brand: 'OPI', category_id: 'cat-10', price: 650,
    stock: 100, sku: 'OPI-NP-CR',
    skin_type: [], concerns: [],
    ingredients: 'Ethyl Acetate, Butyl Acetate, Nitrocellulose, Tosylamide/Formaldehyde Resin, Isopropyl Alcohol',
    short_description: 'Chip-resistant nail polish. Shade: Classic Red.',
    shade: 'Classic Red', shade_hex: '#C0392B',
    is_vegan: true, is_cruelty_free: true, is_published: true,
    tags: ['nail-polish', 'red', 'long-wear'],
  },

  // ── BODY & BATH ──────────────────────────────────────────────────────────
  {
    id: 'prod-038', name: 'Brightening Body Serum 150ml', slug: 'brightening-body-serum-150ml',
    brand: 'Palmer\'s', category_id: 'cat-11', price: 1650,
    stock: 55, sku: 'PM-BBS-150', volume_ml: 150,
    skin_type: ['all'], concerns: ['hyperpigmentation', 'brightening'],
    ingredients: 'Aqua, Vitamin C 5%, Niacinamide, Glycerin, Shea Butter, Sweet Almond Oil, Vitamin E',
    short_description: 'Brightening body serum with vitamin C and niacinamide that evens body skin tone.',
    is_natural: true, is_published: true,
    tags: ['body-serum', 'brightening', 'vitamin-c'],
  },
  {
    id: 'prod-039', name: 'Coffee Body Scrub 200g', slug: 'coffee-body-scrub-200g',
    brand: 'Frank Body', category_id: 'cat-11', price: 1800,
    stock: 40, sku: 'FB-CBS-200',
    skin_type: ['all'], concerns: ['brightening', 'hydration'],
    ingredients: 'Coffee Arabica Grounds, Sweet Almond Oil, Sea Salt, Shea Butter, Vitamin E, Coconut Oil',
    short_description: 'Natural coffee body scrub that exfoliates, hydrates and brightens skin.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['body-scrub', 'coffee', 'natural', 'exfoliant'],
  },
  {
    id: 'prod-040', name: 'Shea & Cocoa Butter Body Lotion 300ml', slug: 'shea-cocoa-butter-body-lotion-300ml',
    brand: 'Vaseline', category_id: 'cat-11', price: 850,
    stock: 120, sku: 'VS-SCB-300', volume_ml: 300,
    skin_type: ['dry', 'sensitive', 'all'], concerns: ['hydration'],
    ingredients: 'Aqua, Shea Butter, Cocoa Butter, Glycerin, Dimethicone, Petrolatum, Allantoin',
    short_description: 'Rich body lotion with shea and cocoa butter for 48-hour moisture.',
    is_published: true,
    tags: ['body-lotion', 'shea', 'cocoa-butter', 'hydration'],
  },

  // ── HAIR CARE ────────────────────────────────────────────────────────────
  {
    id: 'prod-041', name: 'Argan Oil Hair Treatment Serum 100ml', slug: 'argan-oil-hair-treatment-serum-100ml',
    brand: 'OGX', category_id: 'cat-12', price: 1500,
    stock: 45, sku: 'OGX-AOT-100', volume_ml: 100,
    skin_type: [], concerns: [],
    ingredients: 'Cyclopentasiloxane, Dimethicone, Argania Spinosa Kernel Oil, Tocopheryl Acetate, Fragrance',
    short_description: 'Lightweight argan oil serum that tames frizz, adds shine and protects from heat.',
    is_natural: false, is_published: true,
    tags: ['hair-serum', 'argan-oil', 'frizz-control'],
  },
  {
    id: 'prod-042', name: 'Strengthening Scalp Shampoo 250ml', slug: 'strengthening-scalp-shampoo-250ml',
    brand: 'Head & Shoulders', category_id: 'cat-12', price: 950,
    stock: 80, sku: 'HS-SCS-250', volume_ml: 250,
    skin_type: [], concerns: [],
    ingredients: 'Aqua, Ammonium Lauryl Sulfate, Zinc Pyrithione 1%, Glycerin, Panthenol, Citric Acid',
    short_description: 'Anti-dandruff shampoo that strengthens scalp health and reduces flaking.',
    is_published: true,
    tags: ['shampoo', 'anti-dandruff', 'scalp'],
  },

  // ── TOOLS & ACCESSORIES ───────────────────────────────────────────────────
  {
    id: 'prod-043', name: 'Rose Quartz Facial Roller', slug: 'rose-quartz-facial-roller',
    brand: 'Mount Lai', category_id: 'cat-13', price: 2200,
    stock: 30, sku: 'ML-RQR',
    skin_type: ['all'], concerns: ['puffiness', 'redness'],
    ingredients: 'Rose Quartz, Stainless Steel',
    short_description: 'Genuine rose quartz facial roller that reduces puffiness and boosts circulation.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['facial-roller', 'rose-quartz', 'tools'],
  },
  {
    id: 'prod-044', name: 'Jade Gua Sha Sculpting Tool', slug: 'jade-gua-sha-sculpting-tool',
    brand: 'Herbivore', category_id: 'cat-13', price: 1800,
    stock: 25, sku: 'HB-JGS',
    skin_type: ['all'], concerns: ['puffiness', 'anti-aging'],
    ingredients: 'Nephrite Jade',
    short_description: 'Authentic jade gua sha tool for facial sculpting and lymphatic drainage.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['gua-sha', 'jade', 'sculpting', 'tools'],
  },
  {
    id: 'prod-045', name: 'Bamboo Makeup Brush Set — 12pc', slug: 'bamboo-makeup-brush-set-12pc',
    brand: 'EcoTools', category_id: 'cat-13', price: 2800,
    stock: 20, sku: 'ET-BBS-12',
    skin_type: ['all'], concerns: [],
    ingredients: 'Bamboo Handle, Synthetic Taklon Bristles, Aluminium Ferrule',
    short_description: 'Eco-friendly bamboo brush set with synthetic bristles. 12 essential makeup brushes.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['makeup-brushes', 'bamboo', 'eco-friendly', 'tools'],
  },

  // ── NATURAL & ORGANIC ────────────────────────────────────────────────────
  {
    id: 'prod-046', name: 'Rosehip Facial Oil 30ml', slug: 'rosehip-facial-oil-30ml',
    brand: 'Trilogy', category_id: 'cat-14', price: 3200,
    stock: 30, sku: 'TL-RFO-30', volume_ml: 30,
    skin_type: ['dry', 'combination', 'sensitive', 'all'], concerns: ['anti-aging', 'hyperpigmentation', 'brightening'],
    ingredients: 'Rosa Canina Fruit Oil (Rosehip) 100%, Vitamin E (Tocopherol)',
    short_description: '100% certified organic rosehip oil that fades scars and brightens skin naturally.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['rosehip-oil', 'organic', 'natural', 'facial-oil'],
  },
  {
    id: 'prod-047', name: 'Tea Tree & Aloe Vera Gel 100ml', slug: 'tea-tree-aloe-vera-gel-100ml',
    brand: 'The Body Shop', category_id: 'cat-14', price: 1100,
    stock: 55, sku: 'TBS-TAV-100', volume_ml: 100,
    skin_type: ['oily', 'combination', 'sensitive'], concerns: ['acne', 'redness', 'sensitivity'],
    ingredients: 'Aloe Barbadensis Leaf Juice 95%, Melaleuca Alternifolia Leaf Oil 2%, Glycerin, Allantoin',
    short_description: 'Soothing tea tree and aloe vera gel that calms breakouts and redness.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['tea-tree', 'aloe-vera', 'natural', 'acne'],
  },
  {
    id: 'prod-048', name: 'Bakuchiol Natural Retinol Alternative 30ml', slug: 'bakuchiol-natural-retinol-alternative-30ml',
    brand: 'Herbivore', category_id: 'cat-14', price: 4200,
    stock: 20, sku: 'HB-BAK-30', volume_ml: 30,
    skin_type: ['sensitive', 'dry', 'combination'], concerns: ['anti-aging', 'brightening', 'sensitivity'],
    ingredients: 'Aloe Vera Leaf Juice, Bakuchiol 1%, Rosehip Oil, Squalane, Jojoba Oil, Vitamin C, Niacinamide',
    short_description: 'Plant-powered bakuchiol serum — all the anti-aging benefits of retinol, gentle for sensitive skin.',
    is_vegan: true, is_cruelty_free: true, is_natural: true, is_published: true,
    tags: ['bakuchiol', 'natural-retinol', 'anti-aging', 'sensitive'],
  },
];

// ─── COUPONS ──────────────────────────────────────────────────────────────────

const coupons = [
  {
    id: 'coup-01', code: 'WELCOME10', description: '10% off your first order — welcome gift',
    type: 'percentage', value: 10, min_order_value: 0, max_uses: 500, per_user_limit: 1,
    is_active: true, starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'coup-02', code: 'GLOW200', description: 'KES 200 off orders over KES 1,500',
    type: 'fixed', value: 200, min_order_value: 1500, max_uses: 200, per_user_limit: 2,
    is_active: true, starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'coup-03', code: 'FREESHIP', description: 'Free shipping on any order over KES 1,000',
    type: 'free_shipping', value: 0, min_order_value: 1000, max_uses: null, per_user_limit: 5,
    is_active: true, starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── PRODUCT IMAGES ──────────────────────────────────────────────────────────
// Using Unsplash photos relevant to each product category

const productImages = products.map((p, i) => {
  const unsplashIds = [
    'a-woman-with-a-bottle-of-serum-_U0Qz8IYZ0c', // serums
    'white-and-gold-round-ornament-JjGXjESMxOY',
    'flat-lay-photography-of-white-cosmetic-bottles-TLBdcVl7tU0',
    'woman-holding-plastic-bottle-near-white-wall-4SocAY1E3bM',
    'skincare-products-3bSSbsFWJmA',
  ];
  return {
    id: `img-${p.id}`,
    product_id: p.id,
    url: `https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&crop=center`,
    alt: p.name,
    sort_order: 0,
    is_primary: true,
  };
});

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿  Anashe Skincare — Database Seeder\n');
  console.log('  Project:', SUPABASE_URL);
  console.log();

  // Verify schema exists
  const { error: checkError } = await supabase.from('categories').select('id').limit(1);
  if (checkError && checkError.code === 'PGRST204') {
    console.error('❌  Schema not found. Please run the SQL migrations first:');
    console.error('   → https://supabase.com/dashboard/project/tkdqamzaqarmfoxxtypw/sql/new');
    console.error('   → Paste contents of: supabase/migrations/001_initial_schema.sql');
    console.error('   → Then paste: supabase/migrations/002_rls_policies.sql');
    process.exit(1);
  }

  // Clear existing seed data by slugs/codes (UUID-safe)
  console.log('  Cleaning previous seed data...');
  const productSlugs = products.map((p) => p.slug);
  const categorySlugs = categories.map((c) => c.slug);
  const couponCodes = coupons.map((c) => c.code);

  const { data: existingProducts } = await supabase
    .from('products')
    .select('id,slug')
    .in('slug', productSlugs);
  const existingProductIds = (existingProducts ?? []).map((p) => p.id);

  if (existingProductIds.length > 0) {
    await supabase.from('product_images').delete().in('product_id', existingProductIds);
  }
  await supabase.from('products').delete().in('slug', productSlugs);
  await supabase.from('categories').delete().in('slug', categorySlugs);
  await supabase.from('coupons').delete().in('code', couponCodes);
  console.log('  Done.\n');

  // Insert categories first
  const categoriesForInsert = categories.map(({ id, ...row }) => row);
  await upsert('categories', categoriesForInsert, 'Inserting 14 categories', 'slug');

  // Resolve category UUIDs and map old category IDs to real UUIDs
  const { data: insertedCategories } = await supabase
    .from('categories')
    .select('id,slug')
    .in('slug', categorySlugs);
  const slugToCategoryId = new Map((insertedCategories ?? []).map((c) => [c.slug, c.id]));
  const legacyCategoryIdToSlug = new Map(categories.map((c) => [c.id, c.slug]));

  const productsForInsert = products.map(({ id, category_id, ...row }) => {
    const categorySlug = legacyCategoryIdToSlug.get(category_id);
    return {
      ...row,
      category_id: categorySlug ? slugToCategoryId.get(categorySlug) ?? null : null,
    };
  });
  await upsert('products', productsForInsert, `Inserting ${products.length} skincare & cosmetic products`, 'slug');

  // Resolve product UUIDs and insert images
  const { data: insertedProducts } = await supabase
    .from('products')
    .select('id,slug')
    .in('slug', productSlugs);
  const slugToProductId = new Map((insertedProducts ?? []).map((p) => [p.slug, p.id]));
  const legacyProductIdToSlug = new Map(products.map((p) => [p.id, p.slug]));
  const productImagesForInsert = productImages
    .map(({ id, product_id, ...img }) => {
      const productSlug = legacyProductIdToSlug.get(product_id);
      const realProductId = productSlug ? slugToProductId.get(productSlug) : null;
      if (!realProductId) return null;
      return { ...img, product_id: realProductId };
    })
    .filter(Boolean);
  await insertRows('product_images', productImagesForInsert, 'Inserting product images');

  const couponsForInsert = coupons.map(({ id, ...row }) => row);
  await upsert('coupons', couponsForInsert, 'Inserting 3 coupons', 'code');

  // Verify
  const { count: categoryCount } = await supabase.from('categories').select('id', { count: 'exact', head: true });
  const { count: publishedCount } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_published', true);
  const { count: imageCount } = await supabase.from('product_images').select('id', { count: 'exact', head: true });
  const { data: couponData } = await supabase.from('coupons').select('code');

  console.log('\n✅  Seeding complete!\n');
  console.log(`  Categories:     ${categoryCount ?? 0}`);
  console.log(`  Products:       ${publishedCount ?? 0} published`);
  console.log(`  Images:         ${imageCount ?? 0}`);
  console.log(`  Coupons:        ${couponData?.map(c => c.code).join(', ')}`);
  console.log('\n  Run: npm run dev\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
