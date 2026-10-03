import { useEffect } from "react";
import { Link } from "react-router-dom";
import CoffeeImage from "../components/CoffeeImage";
import { useCart } from "../context/useCart";

function BagPage() {
  const { items, setQuantity, removeItem, syncStock } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    let cancelled = false;

    async function refreshStock() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!response.ok || cancelled) {
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          syncStock(data);
        }
      } catch {
        // Keep the saved bag when the API cannot be reached.
      }
    }

    refreshStock();

    return () => {
      cancelled = true;
    };
  }, [syncStock]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Your selection</p>
      <h1 className="mt-3 font-serif text-5xl text-stone-900">Bag</h1>
      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-stone-600">Your bag is empty.</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
          >
            Browse coffees
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6">
                <CoffeeImage
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-2xl">{item.name}</h2>
                    <p>₹{item.price * item.quantity}</p>
                  </div>
                  <p className="text-sm text-stone-600">₹{item.price} each</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border border-stone-300"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="h-8 w-8 rounded-full border border-stone-300 disabled:opacity-40"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-sm text-stone-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-600">Total</p>
            <p className="mt-1 font-serif text-4xl">₹{total}</p>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              This bag is a preview. Mistline does not take orders or payments
              online.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default BagPage;
