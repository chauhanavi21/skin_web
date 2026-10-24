import { Router } from 'express';
import { db } from '../db.js';
import { HttpError } from '../http.js';

const router = Router();

const SORTS = {
  featured: 'featured DESC, review_count DESC',
  'price-asc': 'price_cents ASC',
  'price-desc': 'price_cents DESC',
  rating: 'rating DESC, review_count DESC',
  name: 'name COLLATE NOCASE ASC',
};

export function toProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    type: row.type,
    description: row.description,
    ingredients: row.ingredients,
    size: row.size,
    priceCents: row.price_cents,
    stock: row.stock,
    emoji: row.emoji,
    hue: row.hue,
    rating: row.rating,
    reviewCount: row.review_count,
    featured: Boolean(row.featured),
  };
}

// GET /api/products?category=skin&type=serum&q=vitamin&sort=price-asc&featured=1
router.get('/', (req, res) => {
  const { category, type, q, sort = 'featured', featured } = req.query;
  const where = [];
  const params = [];

  if (typeof category === 'string' && category) {
    where.push('category = ?');
    params.push(category);
  }
  if (typeof type === 'string' && type) {
    where.push('type = ?');
    params.push(type);
  }
  if (featured === '1') where.push('featured = 1');
  if (typeof q === 'string' && q.trim()) {
    const like = `%${q.trim().replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
    where.push(`(name LIKE ? ESCAPE '\\' OR brand LIKE ? ESCAPE '\\' OR type LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\')`);
    params.push(like, like, like, like);
  }

  const orderBy = SORTS[sort] || SORTS.featured;
  const sql = `SELECT * FROM products ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${orderBy}`;
  res.json(db.prepare(sql).all(...params).map(toProduct));
});

// GET /api/products/meta -> categories and their product types, for building filters
router.get('/meta', (_req, res) => {
  const rows = db.prepare('SELECT category, type, COUNT(*) AS n FROM products GROUP BY category, type ORDER BY category, type').all();
  const categories = {};
  for (const r of rows) (categories[r.category] ||= []).push({ type: r.type, count: r.n });
  res.json({ categories });
});

router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!row) throw new HttpError(404, 'Product not found.');
  const related = db
    .prepare('SELECT * FROM products WHERE category = ? AND id != ? ORDER BY (type = ?) DESC, rating DESC LIMIT 4')
    .all(row.category, row.id, row.type);
  res.json({ ...toProduct(row), related: related.map(toProduct) });
});

export default router;
