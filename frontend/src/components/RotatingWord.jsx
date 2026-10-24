import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Cycles through `words` with a slide-up transition. Words share one grid cell so the slot keeps a
 * constant height, and the slot's width animates to fit the visible word so the text after it
 * never leaves a gap.
 */
export default function RotatingWord({ words, interval = 2600 }) {
  const [active, setActive] = useState(0);
  const [widths, setWidths] = useState(null);
  const refs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => setActive((n) => (n + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  // Measure each word's natural width, and again when fonts finish loading or the size changes.
  useLayoutEffect(() => {
    const measure = () => setWidths(refs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [words]);

  const previous = (active + words.length - 1) % words.length;

  return (
    <span
      className="relative -mb-[0.14em] inline-grid justify-items-start overflow-hidden pb-[0.14em] align-bottom transition-[width] duration-700 ease-out"
      style={widths ? { width: widths[active] } : undefined}
    >
      {words.map((word, i) => {
        const position = i === active ? 'translate-y-0 opacity-100' : i === previous ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0';
        return (
          <span
            key={word}
            ref={(el) => { refs.current[i] = el; }}
            aria-hidden={i !== active}
            className={`col-start-1 row-start-1 animate-shimmer whitespace-nowrap bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600 bg-[length:200%_auto] bg-clip-text text-transparent transition-all duration-700 ease-out ${position}`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
