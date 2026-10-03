import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiErrorMessage, readApiError } from "../apiError";
import ProductForm from "../components/ProductForm";

const origins = ["Chikmagalur", "Coorg", "Araku"];
const roasts = ["Light", "Medium", "Dark"];

function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [reloadKey]);

  function retryLoad() {
    setError("");
    setStatus("loading");
    setReloadKey((current) => current + 1);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  async function deleteCoffee(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        setError(await readApiError(response, "Could not delete coffee"));
        return;
      }

      setError("");
      setReloadKey((current) => current + 1);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete coffee"));
    }
  }

  if (status === "loading") {
    return <p className="p-8 text-stone-600">Loading dashboard...</p>;
  }

  if (status === "error") {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-5xl text-stone-900">Dashboard</h1>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-stone-300 px-4 py-2 text-sm"
          >
            Log out
          </button>
        </div>
        <p className="mt-8 text-red-700">{error}</p>
        <button
          type="button"
          onClick={retryLoad}
          className="mt-4 rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );
  const outOfStock = products.filter((product) => product.stock === 0).length;

  const stats = [
    { label: "Coffees", value: products.length },
    { label: "Bags in stock", value: totalStock },
    { label: "Inventory value", value: `₹${inventoryValue}` },
    { label: "Out of stock", value: outOfStock },
  ];

  const stockByOrigin = origins.map((origin) => ({
    origin,
    stock: products
      .filter((product) => product.origin === origin)
      .reduce((sum, product) => sum + product.stock, 0),
  }));

  const countByRoast = roasts.map((roast) => ({
    roast,
    coffees: products.filter((product) => product.roast === roast).length,
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-5xl text-stone-900">Dashboard</h1>
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm"
        >
          Log out
        </button>
      </div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-stone-200 bg-white p-4"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-medium text-stone-900">Stock by origin</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByOrigin}>
                <XAxis dataKey="origin" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="stock" fill="#3c2e23" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-medium text-stone-900">Coffees by roast</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countByRoast}>
                <XAxis dataKey="roast" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="coffees" fill="#3c2e23" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-stone-900">Coffees</h2>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
          >
            Add coffee
          </button>
        </div>
        {error ? <p className="mt-4 text-red-700">{error}</p> : null}
        <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Origin</th>
                <th className="px-4 py-3 font-medium">Roast</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-stone-600">
                    No coffees yet.
                  </td>
                </tr>
              ) : null}
              {products.map((product) => (
                <tr key={product._id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.origin}</td>
                  <td className="px-4 py-3">{product.roast}</td>
                  <td className="px-4 py-3">₹{product.price}</td>
                  <td className="px-4 py-3">
                    {product.stock === 0 ? "Out of stock" : product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      className="text-stone-900 underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoffee(product)}
                      className="ml-4 text-red-700 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing !== null ? (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setReloadKey((current) => current + 1);
          }}
        />
      ) : null}
    </main>
  );
}

export default AdminPage;