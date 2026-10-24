import { pathToFileURL } from 'node:url';
import { db, transaction } from './db.js';

// [slug, name, brand, category, type, size, price, stock, emoji, hue, rating, reviews, featured, description, ingredients]
const PRODUCTS = [
  // ---- Skincare ----
  ['gentle-cloud-cleanser', 'Gentle Cloud Cleanser', 'Lumea', 'skin', 'cleanser', '150 ml', 1400, 60, '🫧', 190, 4.7, 412, 1,
    'A soft, low-foam gel cleanser that lifts makeup and SPF without stripping the skin barrier.',
    'Aqua, Glycerin, Coco-Glucoside, Panthenol, Allantoin, Aloe Barbadensis Leaf Juice'],
  ['green-tea-foam-wash', 'Green Tea Foam Wash', 'Lumea', 'skin', 'cleanser', '120 ml', 1200, 45, '🍵', 120, 4.5, 238, 0,
    'Daily foaming wash with antioxidant-rich green tea to keep oily and combination skin balanced.',
    'Aqua, Camellia Sinensis Leaf Extract, Sodium Cocoyl Isethionate, Glycerin, Zinc PCA'],
  ['oat-milk-cream-cleanser', 'Oat Milk Cream Cleanser', 'Oatly Skin', 'skin', 'cleanser', '150 ml', 1600, 30, '🌾', 45, 4.8, 191, 0,
    'Ultra-soothing cream cleanser for dry or sensitive skin. Fragrance free.',
    'Aqua, Avena Sativa Kernel Extract, Squalane, Glycerin, Ceramide NP'],
  ['rose-hydrating-toner', 'Rose Hydrating Toner', 'Petal & Pine', 'skin', 'toner', '200 ml', 1800, 52, '🌹', 345, 4.6, 305, 0,
    'Alcohol-free toner that preps skin for the next steps and leaves a dewy, plump finish.',
    'Rosa Damascena Flower Water, Hyaluronic Acid, Glycerin, Betaine'],
  ['vitamin-c-brightening-serum', 'Vitamin C Brightening Serum', 'Lumea', 'skin', 'serum', '30 ml', 2800, 40, '🍊', 28, 4.7, 689, 1,
    'A 15% stabilised vitamin C serum that visibly evens tone and boosts radiance in 4 weeks.',
    'Aqua, Ascorbic Acid, Ferulic Acid, Tocopherol, Sodium Hyaluronate, Propanediol'],
  ['niacinamide-clarifying-serum', 'Niacinamide 10% Clarifying Serum', 'Dermis Lab', 'skin', 'serum', '30 ml', 1900, 75, '💧', 205, 4.4, 1020, 1,
    'Minimises the look of pores and balances oil with 10% niacinamide and 1% zinc.',
    'Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Tamarindus Indica Seed Gum'],
  ['hyaluronic-plumping-serum', 'Hyaluronic Plumping Serum', 'Petal & Pine', 'skin', 'serum', '30 ml', 2200, 33, '💦', 215, 4.6, 344, 0,
    'Three weights of hyaluronic acid for multi-level hydration that lasts all day.',
    'Aqua, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Panthenol, Glycerin'],
  ['retinol-night-serum', 'Retinol Renewal Night Serum', 'Dermis Lab', 'skin', 'serum', '30 ml', 3200, 22, '🌙', 265, 4.5, 512, 0,
    'Gentle encapsulated retinol that smooths fine lines while you sleep. Use at night only.',
    'Aqua, Squalane, Retinol, Bakuchiol, Tocopherol, Caprylic/Capric Triglyceride'],
  ['ceramide-barrier-cream', 'Ceramide Barrier Cream', 'Oatly Skin', 'skin', 'moisturizer', '50 ml', 2400, 58, '🧈', 40, 4.8, 877, 1,
    'Rich yet non-greasy moisturiser that repairs and protects a compromised skin barrier.',
    'Aqua, Glycerin, Ceramide NP, Ceramide AP, Cholesterol, Shea Butter, Squalane'],
  ['light-gel-moisturizer', 'Light Gel Moisturizer', 'Lumea', 'skin', 'moisturizer', '50 ml', 1700, 64, '🫐', 235, 4.3, 266, 0,
    'Oil-free water gel that hydrates without heaviness. Ideal under makeup and SPF.',
    'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Dimethicone'],
  ['mineral-sunscreen-spf50', 'Mineral Sunscreen SPF 50', 'Solis', 'skin', 'sunscreen', '50 ml', 2000, 80, '☀️', 55, 4.6, 730, 1,
    'Broad-spectrum zinc oxide sunscreen with a sheer, no-white-cast finish.',
    'Zinc Oxide, Squalane, Caprylic/Capric Triglyceride, Tocopherol, Iron Oxides'],
  ['daily-glow-sunscreen-spf30', 'Daily Glow Sunscreen SPF 30', 'Solis', 'skin', 'sunscreen', '50 ml', 1500, 70, '🌤️', 40, 4.2, 158, 0,
    'Lightweight daily SPF with a subtle glow. Layers perfectly under makeup.',
    'Aqua, Octocrylene, Zinc Oxide, Glycerin, Niacinamide'],
  ['clay-detox-mask', 'Kaolin Clay Detox Mask', 'Petal & Pine', 'skin', 'mask', '75 ml', 1900, 36, '🏺', 20, 4.4, 201, 0,
    'Weekly purifying mask that draws out impurities while leaving skin soft, not tight.',
    'Kaolin, Bentonite, Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Charcoal Powder'],
  ['peptide-eye-cream', 'Peptide Eye Cream', 'Lumea', 'skin', 'eye-care', '15 ml', 2600, 28, '👁️', 280, 4.5, 143, 0,
    'Targets puffiness and dark circles with caffeine and a blend of firming peptides.',
    'Aqua, Caffeine, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Glycerin, Squalane'],

  // ---- Haircare ----
  ['argan-repair-shampoo', 'Argan Repair Shampoo', 'Mane Theory', 'hair', 'shampoo', '300 ml', 1600, 90, '🌿', 100, 4.6, 540, 1,
    'Sulfate-free shampoo enriched with argan oil to cleanse gently and restore shine to damaged hair.',
    'Aqua, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Panthenol, Glycerin'],
  ['scalp-balance-shampoo', 'Scalp Balance Shampoo', 'Mane Theory', 'hair', 'shampoo', '300 ml', 1800, 55, '🍃', 160, 4.5, 322, 0,
    'Soothes an itchy, oily scalp with salicylic acid and tea tree oil.',
    'Aqua, Salicylic Acid, Melaleuca Alternifolia Leaf Oil, Zinc PCA, Menthol'],
  ['curl-defining-shampoo', 'Curl Defining Shampoo', 'Coil & Co', 'hair', 'shampoo', '300 ml', 1700, 48, '🌀', 310, 4.7, 410, 0,
    'Moisture-first cleanser that keeps curls bouncy and frizz free.',
    'Aqua, Decyl Glucoside, Aloe Barbadensis Leaf Juice, Shea Butter, Glycerin'],
  ['argan-repair-conditioner', 'Argan Repair Conditioner', 'Mane Theory', 'hair', 'conditioner', '300 ml', 1700, 84, '💛', 48, 4.6, 468, 0,
    'Silky conditioner that detangles and seals split ends for smooth, manageable hair.',
    'Aqua, Cetearyl Alcohol, Argania Spinosa Kernel Oil, Behentrimonium Chloride, Panthenol'],
  ['coconut-hydration-conditioner', 'Coconut Hydration Conditioner', 'Coil & Co', 'hair', 'conditioner', '300 ml', 1600, 61, '🥥', 30, 4.4, 189, 0,
    'Deeply moisturising conditioner for dry, thirsty strands.',
    'Aqua, Cocos Nucifera Oil, Cetyl Alcohol, Glycerin, Hydrolyzed Wheat Protein'],
  ['bond-repair-hair-mask', 'Bond Repair Hair Mask', 'Mane Theory', 'hair', 'hair-mask', '200 ml', 2800, 38, '🧬', 285, 4.8, 903, 1,
    'Intensive weekly treatment that rebuilds bonds in colour-treated and heat-damaged hair.',
    'Aqua, Cetearyl Alcohol, Hydrolyzed Keratin, Maleic Acid, Shea Butter, Panthenol'],
  ['rosemary-scalp-oil', 'Rosemary Scalp Oil', 'Root & Ritual', 'hair', 'hair-oil', '60 ml', 2100, 70, '🌱', 135, 4.5, 612, 1,
    'Lightweight scalp and hair oil with rosemary, castor and jojoba to support healthy-looking growth.',
    'Ricinus Communis Seed Oil, Simmondsia Chinensis Seed Oil, Rosmarinus Officinalis Leaf Oil, Tocopherol'],
  ['shine-finishing-serum', 'Shine Finishing Serum', 'Root & Ritual', 'hair', 'hair-oil', '50 ml', 1800, 66, '✨', 50, 4.3, 207, 0,
    'Weightless silicone-free serum that tames frizz and adds a glass-like shine.',
    'Squalane, Camellia Oleifera Seed Oil, Tocopherol, Parfum'],
  ['curl-cream-leave-in', 'Curl Cream Leave-In', 'Coil & Co', 'hair', 'styling', '200 ml', 1900, 44, '🌸', 330, 4.6, 275, 0,
    'Soft-hold leave-in cream that defines curls and fights humidity.',
    'Aqua, Shea Butter, Glycerin, Flaxseed Extract, Panthenol'],
  ['heat-shield-spray', 'Heat Shield Spray', 'Mane Theory', 'hair', 'styling', '150 ml', 1500, 59, '🔥', 10, 4.4, 164, 0,
    'Protects hair up to 230°C while adding a light, flexible hold.',
    'Aqua, Panthenol, Hydrolyzed Silk, Glycerin, PVP'],

  // ---- Body ----
  ['shea-body-butter', 'Whipped Shea Body Butter', 'Solis', 'body', 'body-care', '200 ml', 2000, 50, '🥜', 35, 4.7, 355, 0,
    'Cloud-soft body butter with shea and cocoa butter for 48-hour moisture.',
    'Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Glycerin, Tocopherol'],
  ['lavender-body-wash', 'Lavender Calming Body Wash', 'Petal & Pine', 'body', 'body-care', '300 ml', 1400, 77, '💜', 270, 4.5, 221, 0,
    'Creamy body wash with lavender essential oil for a calming end-of-day shower.',
    'Aqua, Coco-Glucoside, Lavandula Angustifolia Oil, Glycerin, Aloe Barbadensis Leaf Juice'],
];

export function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM products').get();
  if (n > 0) return false;
  insertAll();
  return true;
}

function insertAll() {
  const insert = db.prepare(`
    INSERT INTO products
      (slug, name, brand, category, type, size, price_cents, stock, emoji, hue, rating, review_count, featured, description, ingredients)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  transaction(() => {
    for (const p of PRODUCTS) insert.run(...p);
  });
}

// `npm run seed` wipes the catalog and reseeds. Existing orders keep their own item snapshots,
// so product rows referenced by orders are left alone and only missing ones are added.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--reset')) {
    const used = db.prepare('SELECT COUNT(*) AS n FROM order_items').get().n;
    if (used > 0) {
      console.error('Refusing to reset: orders reference existing products. Delete data/ecom.db to start over.');
      process.exit(1);
    }
    db.exec('DELETE FROM products');
  }
  console.log(seedIfEmpty() ? `Seeded ${PRODUCTS.length} products.` : 'Products already present; nothing to do.');
}
