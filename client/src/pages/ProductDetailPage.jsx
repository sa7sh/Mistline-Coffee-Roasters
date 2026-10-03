import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiErrorMessage } from "../apiError";
import CoffeeImage from "../components/CoffeeImage";
import { useCart } from "../context/useCart";

function ProductDetailPage() {
  const { id } = useParams();
  const { items, addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [quantityForId, setQuantityForId] = useState(id);

  if (id !== quantityForId) {
    setQuantityForId(id);
    setQuantity(1);
    setNotice("");
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        );
        if (cancelled) {
          return;
        }
        if (response.status === 404) {
          setStatus("not-found");
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load this coffee");
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        setProduct(data);
        setStatus("ready");
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(apiErrorMessage(err, "Could not load this coffee"));
        setStatus("error");
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return <p className="p-8 text-stone-600">Loading coffee...</p>;
  }

  if (status === "not-found") {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-5xl text-stone-900">Coffee not found</h1>
        <p className="mt-4 text-stone-600">That bag is not in the catalog.</p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
        >
          Back to coffees
        </Link>
      </main>
    );
  }

  if (status === "error") {
    return <p className="p-8 text-red-700">{error}</p>;
  }

  const inBag = items.find((item) => item.id === product._id)?.quantity || 0;
  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) {
      return;
    }
    if (inBag + quantity > product.stock) {
      setNotice("That's all we have roasted right now.");
      return;
    }
    addItem(product, quantity);
    setNotice("Added to bag.");
  }

  return (
    <main className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-14 md:grid-cols-2">
      <div>
        <Link to="/products" className="text-sm text-stone-600 hover:text-stone-900">
          Back to coffees
        </Link>
        <CoffeeImage
          src={product.image}
          alt={product.name}
          className="mt-6 h-[28rem] w-full rounded-3xl object-cover"
        />
      </div>
      <div className="md:pt-12">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          {product.origin} · {product.roast}
        </p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">{product.name}</h1>
        <p className="mt-5 max-w-md leading-relaxed text-stone-700">
          {product.tastingNotes}
        </p>
        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6">
          <p className="font-serif text-4xl text-stone-900">₹{product.price}</p>
          <p className="mt-2 text-sm text-stone-600">{product.weight} g whole bean</p>
          {outOfStock ? (
            <p className="mt-4 text-red-700">Out of stock</p>
          ) : (
            <p className="mt-4 text-stone-600">{product.stock} in stock</p>
          )}
          {outOfStock ? null : (
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="h-10 w-10 rounded-full border border-stone-300"
              >
                −
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity((current) => Math.min(product.stock, current + 1))
                }
                className="h-10 w-10 rounded-full border border-stone-300"
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="mt-6 w-full rounded-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-white disabled:opacity-50"
          >
            {outOfStock ? "Out of stock" : "Add to bag"}
          </button>
          {notice ? <p className="mt-3 text-sm text-stone-600">{notice}</p> : null}
          {inBag > 0 ? (
            <Link to="/bag" className="mt-3 inline-block text-sm text-stone-900 underline">
              {inBag} in your bag
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
