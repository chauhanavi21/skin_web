import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money } from '../api.js';
import { MAX_QTY, useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Stars from '../components/Stars.jsx';
import { Status } from '../components/Status.jsx';
import { useAsync } from '../components/useAsync.js';

export default function ProductPage() {
  const { slug } = useParams();
  const { data: p, error, loading } = useAsync(() => api.product(slug), [slug]);
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    setQty(1);
  }, [slug]);

  if (loading) return <Status loading />;
  if (error) return <Status error={error} />;

  const inCart = lines.find((l) => l.productId === p.id)?.qty ?? 0;
  const maxMore = Math.max(0, Math.min(MAX_QTY, p.stock) - inCart);

  const addToCart = () => {
    add(p, Math.min(qty, maxMore));
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <>
      <p className="mb-4 text-sm capitalize text-slate-500">
        <Link to="/shop" className="hover:text-brand-800">Shop</Link> /{' '}
        <Link to={`/shop?category=${p.category}`} className="hover:text-brand-800">{p.category}</Link> / <span className="text-slate-700">{p.name}</span>
      </p>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="overflow-hidden rounded-3xl shadow-soft md:sticky md:top-28 md:self-start">
          <ProductImage slug={p.slug} name={p.name} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-brand-700">{p.brand}</p>
          <h1 className="mt-1 text-3xl sm:text-4xl">{p.name}</h1>
          <div className="mt-2"><Stars rating={p.rating} count={p.reviewCount} /></div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {money(p.priceCents)} <span className="text-sm font-normal text-slate-500">· {p.size}</span>
          </p>
          <p className="mt-4 text-slate-600">{p.description}</p>

          {p.stock === 0 ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Currently sold out.</p>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label>
                <span className="sr-only">Quantity</span>
                <select className="input w-24 py-3" value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={maxMore === 0}>
                  {Array.from({ length: Math.max(1, maxMore) }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </label>
              <button className="btn flex-1 sm:flex-none sm:px-10" onClick={addToCart} disabled={maxMore === 0}>
                {maxMore === 0 ? 'Max in cart' : justAdded ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>
          )}
          {p.stock > 0 && p.stock <= 10 && <p className="mt-2 text-sm text-amber-700">Only {p.stock} left in stock.</p>}
          {inCart > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              {inCart} in your cart · <Link to="/cart" className="text-brand-800 underline">View cart</Link>
            </p>
          )}

          <div className="mt-8 rounded-2xl bg-brand-50 p-5">
            <h2 className="text-lg">Ingredients</h2>
            <p className="mt-1 text-sm text-slate-600">{p.ingredients}</p>
          </div>
        </div>
      </div>

      {p.related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl sm:text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {p.related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
