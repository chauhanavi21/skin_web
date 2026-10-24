import { Link } from 'react-router-dom';
import { api } from '../api.js';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { Status } from '../components/Status.jsx';
import { useAsync } from '../components/useAsync.js';

const CATEGORIES = [
  { key: 'skin', title: 'Skincare', blurb: 'Cleansers, serums, moisturisers & SPF' },
  { key: 'hair', title: 'Haircare', blurb: 'Shampoos, masks, oils & styling' },
  { key: 'body', title: 'Body', blurb: 'Butters and washes for all-over care' },
];

const PERKS = [
  ['🚚', 'Free shipping', 'On every order over $50'],
  ['🧪', 'Gentle formulas', 'Dermatologist-minded ingredients'],
  ['↩️', 'Easy returns', '30 days, no questions asked'],
];

const MARQUEE = ['Cleansers', 'Serums', 'Moisturisers', 'Sunscreen', 'Shampoo', 'Conditioner', 'Hair masks', 'Body butter', 'Toners', 'Eye care'];

export default function Home() {
  const { data, error, loading } = useAsync(() => api.products({ featured: '1' }), []);

  return (
    <>
      <Hero products={data} />

      {/* ---------- Scrolling category ticker ---------- */}
      <div className="overflow-hidden border-y border-brand-100 bg-brand-700 py-3.5 text-brand-50" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className="flex items-center gap-10">
              {word} <span className="text-brand-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="page">
        <ul className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-5">
          {PERKS.map(([icon, title, text], i) => (
            <Reveal as="li" key={title} delay={i * 120} className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-soft">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-xl" aria-hidden="true">{icon}</span>
              <div>
                <p className="font-semibold text-brand-900">{title}</p>
                <p className="text-sm text-slate-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <section className="mt-16 sm:mt-24">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">Shop by category</h2>
            <p className="mt-2 text-slate-500">Everything you need, sorted by routine.</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.key} delay={i * 130}>
                <Link to={`/shop?category=${c.key}`} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[3/4]">
                  <img src={`/images/categories/${c.key}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent transition group-hover:from-brand-900/85" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white transition duration-500 group-hover:-translate-y-1">
                    <h3 className="text-3xl !text-white">{c.title}</h3>
                    <p className="text-sm text-brand-100">{c.blurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-0 transition duration-500 group-hover:opacity-100">
                      Shop now <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <Reveal className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl">Best sellers</h2>
              <p className="mt-2 text-slate-500">The products our customers keep coming back for.</p>
            </div>
            <Link to="/shop" className="shrink-0 text-sm font-semibold text-brand-800 hover:underline">View all →</Link>
          </Reveal>
          <Status loading={loading} error={error} />
          {data && (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {data.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 90}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        <Reveal className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-accent-500 px-6 py-12 text-center text-white sm:mt-24 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-blob rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl !text-white sm:text-4xl">Free shipping on orders over $50</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">Build your routine today and we’ll deliver it to your door at no extra cost.</p>
          <Link to="/shop" className="btn mt-7 bg-white px-8 py-4 text-base text-brand-800 hover:bg-brand-50">Start shopping</Link>
        </Reveal>
      </div>
    </>
  );
}
