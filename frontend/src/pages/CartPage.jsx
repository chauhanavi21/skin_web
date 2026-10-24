import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { FREE_SHIPPING_OVER_CENTS, MAX_QTY, useCart } from '../context/CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { Status } from '../components/Status.jsx';

export function OrderSummary({ cart }) {
  const toFree = FREE_SHIPPING_OVER_CENTS - cart.subtotalCents;
  const progress = Math.min(100, (cart.subtotalCents / FREE_SHIPPING_OVER_CENTS) * 100);
  return (
    <aside className="panel">
      <h2 className="text-lg">Order summary</h2>
      <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        <dt className="text-slate-600">Subtotal</dt>
        <dd className="text-right">{money(cart.subtotalCents)}</dd>
        <dt className="text-slate-600">Shipping</dt>
        <dd className="text-right">{cart.shippingCents === 0 ? 'Free' : money(cart.shippingCents)}</dd>
        <dt className="mt-1 border-t border-brand-100 pt-3 text-base font-semibold">Total</dt>
        <dd className="mt-1 border-t border-brand-100 pt-3 text-right text-base font-semibold">{money(cart.totalCents)}</dd>
      </dl>
      {cart.count > 0 && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {toFree > 0 ? `Add ${money(toFree)} more for free shipping.` : 'You’ve unlocked free shipping!'}
          </p>
        </div>
      )}
    </aside>
  );
}

export default function CartPage() {
  const cart = useCart();

  if (cart.lines.length === 0) {
    return (
      <Status>
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-2">Find something your skin and hair will love.</p>
        <Link to="/shop" className="btn mt-6">Start shopping</Link>
      </Status>
    );
  }

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white shadow-soft">
          {cart.lines.map((l) => (
            <li key={l.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link to={`/product/${l.slug}`} className="w-20 shrink-0 overflow-hidden rounded-xl sm:w-24">
                <ProductImage slug={l.slug} name={l.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-brand-700">{l.brand}</p>
                  <Link to={`/product/${l.slug}`} className="block font-semibold hover:text-brand-800">{l.name}</Link>
                  <p className="text-sm text-slate-500">{money(l.priceCents)} each</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <label>
                    <span className="sr-only">Quantity for {l.name}</span>
                    <select className="input w-20 py-2" value={l.qty} onChange={(e) => cart.setQty(l.productId, Number(e.target.value))}>
                      {Array.from({ length: Math.min(MAX_QTY, l.stock) }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                  </label>
                  <strong className="w-20 text-right">{money(l.priceCents * l.qty)}</strong>
                  <button className="link-btn" onClick={() => cart.remove(l.productId)} aria-label={`Remove ${l.name}`}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <OrderSummary cart={cart} />
          <Link to="/checkout" className="btn w-full py-3.5">Checkout</Link>
        </div>
      </div>
    </>
  );
}
