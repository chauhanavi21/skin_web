export default function Stars({ rating, count }) {
  const full = Math.round(rating);
  return (
    <p className="flex items-center gap-1.5 text-sm" aria-label={`Rated ${rating.toFixed(1)} out of 5 from ${count} reviews`}>
      <span className="tracking-tight text-amber-500" aria-hidden="true">
        {'★'.repeat(full)}
        <span className="text-slate-300">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="text-xs text-slate-500">{rating.toFixed(1)} ({count})</span>
    </p>
  );
}
