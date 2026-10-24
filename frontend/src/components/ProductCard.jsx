import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from './ProductImage.jsx';
import Stars from './Stars.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const soldOut = product.stock === 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden" aria-label={product.name}>
        <ProductImage slug={product.slug} name={product.name} className="transition duration-700 group-hover:scale-110" />
        {soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-xs font-medium text-white">Sold out</span>
        ) : (
          product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-brand-800 shadow-sm backdrop-blur">
              Best seller
            </span>
          )
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-brand-700">{product.brand}</p>
        <h3 className="font-sans text-sm font-semibold leading-snug sm:text-base">
          <Link to={`/product/${product.slug}`} className="hover:text-brand-800">{product.name}</Link>
        </h3>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <strong className="text-base text-slate-900 sm:text-lg">{money(product.priceCents)}</strong>
          <button className="btn btn-sm" disabled={soldOut} onClick={() => add(product)} aria-label={`Add ${product.name} to cart`}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
