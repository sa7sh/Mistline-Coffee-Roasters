import { useCallback, useEffect, useState } from "react";
import { CartContext } from "./useCart";

const storageKey = "mistline-bag";

function readBag() {
  try {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(readBag);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      if (!product || product.stock < 1 || quantity < 1) {
        return current;
      }

      const existing = current.find((item) => item.id === product._id);
      const used = existing ? existing.quantity : 0;
      const nextQuantity = Math.min(product.stock, used + quantity);
      if (nextQuantity === used) {
        return current;
      }

      const entry = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: nextQuantity,
      };

      if (!existing) {
        return [...current, entry];
      }

      return current.map((item) => (item.id === product._id ? entry : item));
    });
  }

  function setQuantity(id, quantity) {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }
        if (quantity < 1) {
          return [];
        }
        return [{ ...item, quantity: Math.min(item.stock, quantity) }];
      }),
    );
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const syncStock = useCallback((products) => {
    if (!Array.isArray(products)) {
      return;
    }

    const byId = new Map(products.map((product) => [product._id, product]));
    setItems((current) => {
      const next = current.flatMap((item) => {
        const product = byId.get(item.id);
        if (!product || product.stock < 1) {
          return [];
        }
        const quantity = Math.min(item.quantity, product.stock);
        if (quantity < 1) {
          return [];
        }
        if (item.stock === product.stock && item.quantity === quantity) {
          return [item];
        }
        return [{ ...item, stock: product.stock, quantity }];
      });
      const unchanged =
        next.length === current.length && next.every((item, index) => item === current[index]);
      return unchanged ? current : next;
    });
  }, []);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, setQuantity, removeItem, syncStock }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartProvider };
