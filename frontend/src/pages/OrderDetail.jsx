import { Link, useLocation, useParams } from 'react-router-dom';
import { api, money } from '../api.js';
import { Status } from '../components/Status.jsx';
import { useAsync } from '../components/useAsync.js';
import { formatDate } from './Orders.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const { data: o, error, loading } = useAsync(() => api.order(id), [id]);

  if (loading || error) return <Status loading={loading} error={error} />;

  return (
    <>
      {state?.placed && (
        <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-100 px-5 py-4 text-brand-900" role="status">
          <p className="font-semibold">Thank you! Your order has been placed.</p>
          <p className="text-sm">A confirmation is saved below. Email receipts will be added later.</p>
        </div>
      )}
      <p className="mb-2 text-sm text-slate-500">
        <Link to="/orders" className="hover:text-brand-800">My orders</Link> / #{o.id}
      </p>
      <h1 className="text-3xl sm:text-4xl">Order #{o.id}</h1>
      <p className="mt-1 text-slate-500">{formatDate(o.createdAt)} · <span className="pill">{o.status}</span></p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white shadow-soft">
          {o.items.map((i) => (
            <li key={i.productId} className="flex items-center gap-4 p-3 sm:p-4">
              <img src={`/images/products/${i.slug}.jpg`} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
              <div className="min-w-0 flex-1">
                <Link to={`/product/${i.slug}`} className="font-semibold hover:text-brand-800">{i.name}</Link>
                <p className="text-sm text-slate-500">{money(i.priceCents)} × {i.qty}</p>
              </div>
              <strong>{money(i.priceCents * i.qty)}</strong>
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          <aside className="panel">
            <h2 className="text-lg">Totals</h2>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-600">Subtotal</dt><dd className="text-right">{money(o.subtotalCents)}</dd>
              <dt className="text-slate-600">Shipping</dt><dd className="text-right">{o.shippingCents === 0 ? 'Free' : money(o.shippingCents)}</dd>
              <dt className="border-t border-brand-100 pt-3 text-base font-semibold">Total</dt>
              <dd className="border-t border-brand-100 pt-3 text-right text-base font-semibold">{money(o.totalCents)}</dd>
            </dl>
          </aside>
          <aside className="panel">
            <h2 className="text-lg">Ships to</h2>
            <p className="mt-2 text-sm text-slate-600">{o.shipping.name}<br />{o.shipping.address}<br />{o.shipping.city} {o.shipping.zip}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
