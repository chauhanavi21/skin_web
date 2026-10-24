import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const NAV = [
  ['/shop', 'All'],
  ['/shop?category=skin', 'Skincare'],
  ['/shop?category=hair', 'Haircare'],
  ['/shop?category=body', 'Body'],
];

const navClass = ({ isActive }) =>
  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-brand-100 text-brand-900' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-900'
  }`;

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 7h14l-1.5 9H7.5L6 7Zm0 0L5.3 4H3" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const search = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
  };

  const searchBox = (
    <form onSubmit={search} role="search" className="w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search serums, shampoo, SPF…"
        aria-label="Search products"
        className="input rounded-full bg-brand-50 py-2 pl-4"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/85 backdrop-blur">
      <div className="page flex items-center gap-3 py-3 sm:gap-6">
        <Link to="/" className="font-display text-2xl font-semibold text-brand-800">Bloom</Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end className={navClass}>{label}</NavLink>
          ))}
        </nav>

        <div className="mx-2 hidden max-w-xs flex-1 md:block lg:max-w-sm">{searchBox}</div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link to="/orders" className="hidden text-sm font-medium text-slate-700 hover:text-brand-800 sm:inline">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button className="link-btn" onClick={() => { logout(); navigate('/'); }}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-brand-800">Sign in</Link>
          )}
          <Link to="/cart" className="relative rounded-full p-2 text-brand-900 transition hover:bg-brand-100" aria-label={`Cart, ${count} items`}>
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-700 px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Phones and small tablets: search and category links sit on their own rows. */}
      <div className="page pb-3 md:hidden">{searchBox}</div>
      <nav className="page no-scrollbar flex gap-1 overflow-x-auto pb-3 md:hidden" aria-label="Main">
        {NAV.map(([to, label]) => (
          <NavLink key={to} to={to} end className={navClass}>{label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
