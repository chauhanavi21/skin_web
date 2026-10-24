import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'bloom.cart';
export const MAX_QTY = 10;
export const FREE_SHIPPING_OVER_CENTS = 5000;
export const FLAT_SHIPPING_CENTS = 599;

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((i) => i && Number.isInteger(i.productId) && i.qty > 0) : [];
  } catch {
    return [];
  }
}

// Each line keeps a small snapshot of the product so the cart renders without refetching.
const snapshot = (p) => ({
  productId: p.id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  emoji: p.emoji,
  hue: p.hue,
  priceCents: p.priceCents,
  stock: p.stock,
});

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((product, qty = 1) => {
    setLines((prev) => {
      const limit = Math.min(MAX_QTY, product.stock);
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) => (l.productId === product.id ? { ...l, ...snapshot(product), qty: Math.min(limit, l.qty + qty) } : l));
      }
      return [...prev, { ...snapshot(product), qty: Math.min(limit, qty) }];
    });
  }, []);

  const setQty = useCallback((productId, qty) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.productId !== productId) return [l];
        if (qty < 1) return [];
        return [{ ...l, qty: Math.min(qty, MAX_QTY, l.stock) }];
      }),
    );
  }, []);

  const remove = useCallback((productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalCents = lines.reduce((n, l) => n + l.qty * l.priceCents, 0);
    const shippingCents = lines.length === 0 || subtotalCents >= FREE_SHIPPING_OVER_CENTS ? 0 : FLAT_SHIPPING_CENTS;
    return { lines, count, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents, add, setQty, remove, clear };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
