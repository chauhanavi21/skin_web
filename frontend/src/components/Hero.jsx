import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { MAX_QTY, useCart } from '../context/CartContext.jsx';
import RotatingWord from './RotatingWord.jsx';

/** Landing hero: headline on the left, a round product showcase (with thumbnails to switch product) on the right. */
export default function Hero({ products }) {
  const { add, lines } = useCart();
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const picks = products?.slice(0, 4) ?? [];
  const product = picks[index];
  const inCart = product ? lines.find((l) => l.productId === product.id)?.qty ?? 0 : 0;
  const room = product ? Math.max(0, Math.min(MAX_QTY, product.stock) - inCart) : 0;
  const shownQty = Math.min(qty, Math.max(1, room));

  const choose = (i) => {
    setIndex(i);
    setQty(1);
    setAdded(false);
  };

  const addToCart = () => {
    if (!product || room === 0) return;
    add(product, shownQty);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="relative isolate overflow-hidden bg-brand-300">
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[26rem] w-[26rem] animate-blob rounded-full bg-brand-200/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/3 -z-10 h-[30rem] w-[30rem] animate-blob rounded-full bg-accent-200/50 blur-3xl [animation-delay:-6s]" />
      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 animate-blob rounded-full bg-brand-100/60 blur-3xl [animation-delay:-10s]" />

      <div className="page py-6 sm:py-10 lg:py-14">
        <div className="grid items-center gap-10 rounded-[2rem] bg-white p-6 shadow-2xl shadow-brand-900/15 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-14">
          {/* ---------- Left: copy + buy box ---------- */}
          <div>
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.4em] text-brand-700 sm:text-sm">
              Clean <span className="text-accent-400">•</span> Kind <span className="text-accent-400">•</span> Effective
            </p>
            <h1 className="mt-4 animate-fade-up text-5xl leading-[1.05] text-accent-500 [animation-delay:150ms] sm:text-6xl xl:text-7xl">
              Skin and hair care for <RotatingWord words={['glowing', 'healthy', 'radiant', 'soft']} /> days.
            </h1>
            <p className="mt-5 max-w-xl animate-fade-up text-base text-slate-600 [animation-delay:300ms] sm:text-lg">
              Thoughtfully formulated essentials for glowing skin and healthy hair, delivered to your door.
            </p>

            <div className="mt-8 animate-fade-up [animation-delay:450ms]">
              <div className="inline-flex flex-wrap items-center gap-4 rounded-2xl bg-brand-50 p-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-slate-500">Choose your quantity</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, shownQty - 1))}
                      disabled={shownQty <= 1}
                      className="grid h-9 w-9 place-items-center rounded-full bg-brand-200 text-lg font-semibold text-brand-800 transition hover:bg-brand-300 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-lg font-semibold" aria-live="polite">{shownQty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(room, shownQty + 1))}
                      disabled={shownQty >= room}
                      className="grid h-9 w-9 place-items-center rounded-full bg-brand-200 text-lg font-semibold text-brand-800 transition hover:bg-brand-300 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!product || room === 0}
                  className="btn px-7 py-4 text-base shadow-lg shadow-brand-700/30 hover:-translate-y-0.5"
                >
                  {!product ? 'Loading…' : room === 0 ? 'Max in cart' : added ? 'Added ✓' : `Add to cart · ${money(product.priceCents * shownQty)}`}
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <Link to="/shop" className="font-semibold text-brand-800 hover:underline">Shop all →</Link>
                <Link to="/cart" className="text-slate-500 hover:text-brand-800">Continue shopping</Link>
              </div>
            </div>
          </div>

          {/* ---------- Right: round showcase ---------- */}
          <div className="flex animate-fade-in flex-col items-center gap-5 [animation-delay:200ms] lg:flex-row lg:gap-6">
            <div className="relative aspect-square w-full max-w-[460px] flex-1">
              <div className="absolute inset-0 rounded-full bg-brand-100" />
              {product ? (
                <Link to={`/product/${product.slug}`} aria-label={product.name}>
                  <img
                    key={product.slug}
                    src={`/images/products/${product.slug}.jpg`}
                    alt={product.name}
                    width="800"
                    height="800"
                    fetchPriority="high"
                    className="absolute inset-[5%] h-[90%] w-[90%] animate-pop-in rounded-full object-cover shadow-2xl ring-8 ring-white"
                  />
                </Link>
              ) : (
                <div className="absolute inset-[5%] animate-pulse rounded-full bg-brand-200" />
              )}

              {product && (
                <>
                  <span className="absolute -left-1 top-[14%] animate-float rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-xl sm:-left-6">
                    ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
                  </span>
                  <span className="absolute -right-1 bottom-[16%] max-w-[70%] animate-float-slow truncate rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xl [animation-delay:-3s] sm:-right-4">
                    {product.name} · {money(product.priceCents)}
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-3 lg:flex-col" role="group" aria-label="Featured products">
              {(picks.length ? picks : Array.from({ length: 4 })).map((p, i) =>
                p ? (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choose(i)}
                    aria-label={`Show ${p.name}`}
                    aria-pressed={i === index}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-full ring-4 transition duration-300 hover:scale-110 sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${
                      i === index ? 'ring-accent-400' : 'ring-brand-100 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={`/images/products/${p.slug}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <div key={i} className="h-14 w-14 animate-pulse rounded-full bg-brand-200 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
