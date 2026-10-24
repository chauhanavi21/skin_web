// Product photos live in public/images/products/<slug>.jpg. The tinted background shows while loading.
export default function ProductImage({ slug, name, className = '' }) {
  return (
    <img
      src={`/images/products/${slug}.jpg`}
      alt={name}
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className={`aspect-square w-full bg-brand-100 object-cover ${className}`}
    />
  );
}
