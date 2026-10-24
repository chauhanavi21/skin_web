import { Link } from 'react-router-dom';

const LINK = 'text-slate-600 transition hover:text-brand-800';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white">
      <div className="page flex flex-col gap-8 py-12 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl font-semibold text-brand-800">Bloom</p>
          <p className="mt-2 text-sm text-slate-500">Clean skincare, haircare and body care for every day.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-4 md:gap-x-10">
          <Link className={LINK} to="/shop?category=skin">Skincare</Link>
          <Link className={LINK} to="/shop?category=hair">Haircare</Link>
          <Link className={LINK} to="/shop?category=body">Body</Link>
          <Link className={LINK} to="/orders">My orders</Link>
        </div>
      </div>
      <p className="page pb-8 text-xs text-slate-400">Demo store. No real payments are taken. Product photos from Unsplash.</p>
    </footer>
  );
}
