import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiErrorMessage } from "../apiError";
import CoffeeImage from "../components/CoffeeImage";

const origins = ["Chikmagalur", "Coorg", "Araku"];
const roasts = ["Light", "Medium", "Dark"];

const fieldClass =
  "w-full rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-800";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("All");
  const [roast, setRoast] = useState("All");
  const [sort, setSort] = useState("name");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`,
        );
        if (!response.ok) {
          throw new Error("Could not load coffees");
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        setProducts(data);
        setStatus("ready");
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(apiErrorMessage(err, "Could not load coffees"));
        setStatus("error");
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setError("");
    setStatus("loading");
    setAttempt((current) => current + 1);
  }

  if (status === "loading") {
    return <p className="p-8 text-stone-600">Loading coffees...</p>;
  }

  if (status === "error") {
    return (
      <main className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="font-serif text-5xl text-stone-900">Coffees</h1>
        <p className="mt-6 text-red-700">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  const visible = products
    .filter((product) =>
      product.name.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .filter((product) => origin === "All" || product.origin === origin)
    .filter((product) => roast === "All" || product.roast === roast)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
        The catalog
      </p>
      <h1 className="mt-3 font-serif text-5xl text-stone-900">Coffees</h1>
      <p className="mt-3 max-w-xl text-stone-600">
        Single-origin bags from Chikmagalur, Coorg, and Araku.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-stone-600">No coffees yet.</p>
      ) : (
        <>
          <form
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block text-sm text-stone-600">
              Search
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Coffee name"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm text-stone-600">
              Origin
              <select
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className={`mt-2 ${fieldClass}`}
              >
                <option value="All">All origins</option>
                {origins.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-stone-600">
              Roast
              <select
                value={roast}
                onChange={(event) => setRoast(event.target.value)}
                className={`mt-2 ${fieldClass}`}
              >
                <option value="All">All roasts</option>
                {roasts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-stone-600">
              Sort
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className={`mt-2 ${fieldClass}`}
              >
                <option value="name">Name A–Z</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
          </form>

          {visible.length === 0 ? (
            <p className="mt-10 text-stone-600">No coffees match those filters.</p>
          ) : (
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <li key={product._id}>
                  <Link
                    to={`/products/${product._id}`}
                    className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="overflow-hidden">
                      <CoffeeImage
                        src={product.image}
                        alt={product.name}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="font-serif text-2xl text-stone-900">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-stone-600">
                        {product.origin} · {product.roast}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg text-stone-900">₹{product.price}</p>
                        {product.stock === 0 ? (
                          <p className="text-sm text-red-700">Out of stock</p>
                        ) : (
                          <p className="text-sm text-stone-600">
                            {product.stock} in stock
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

export default ProductsPage;
