import { useEffect, useId, useRef, useState } from "react";
import { apiErrorMessage, readApiError } from "../apiError";

const emptyProduct = {
  name: "",
  origin: "Chikmagalur",
  roast: "Light",
  tastingNotes: "",
  weight: 250,
  price: 500,
  stock: 0,
  image: "",
};

function ProductForm({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(product || emptyProduct);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const dialogRef = useRef(null);
  const requestRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  function closeForm() {
    requestRef.current?.abort();
    onCloseRef.current();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    dialog?.querySelector("input, select, textarea")?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestRef.current?.abort();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusable = [...dialog.querySelectorAll("input, select, textarea, button")].filter(
        (element) => !element.disabled,
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const token = localStorage.getItem("token");
    const payload = {
      ...form,
      weight: Number(form.weight),
      price: Number(form.price),
      stock: Number(form.stock),
    };
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products${isEdit ? `/${product._id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      );
      if (controller.signal.aborted) {
        return;
      }
      if (!response.ok) {
        throw new Error(await readApiError(response, "Could not save coffee"));
      }
      onSaved();
    } catch (err) {
      if (err.name === "AbortError" || controller.signal.aborted) {
        return;
      }
      setError(apiErrorMessage(err, "Could not save coffee"));
      setStatus("idle");
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-stone-900/40 p-4">
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
      >
        <h2 id={titleId} className="text-xl font-semibold text-stone-900">
          {isEdit ? "Edit coffee" : "Add coffee"}
        </h2>

        <label className="mt-4 block text-sm text-stone-700">
          Name
          <input name="name" value={form.name} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Origin
          <select name="origin" value={form.origin} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2">
            <option>Chikmagalur</option>
            <option>Coorg</option>
            <option>Araku</option>
          </select>
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Roast
          <select name="roast" value={form.roast} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2">
            <option>Light</option>
            <option>Medium</option>
            <option>Dark</option>
          </select>
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Tasting notes
          <input name="tastingNotes" value={form.tastingNotes} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Weight (g)
          <input name="weight" type="number" value={form.weight} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Price (₹)
          <input name="price" type="number" value={form.price} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Stock
          <input name="stock" type="number" value={form.stock} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        <label className="mt-4 block text-sm text-stone-700">
          Image URL
          <input name="image" value={form.image} onChange={updateField} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" required />
        </label>

        {error ? <p className="mt-4 text-red-700">{error}</p> : null}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={status === "saving"} className="rounded-md bg-stone-900 px-4 py-2 text-white disabled:opacity-60">
            {status === "saving" ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={closeForm} className="rounded-md border border-stone-300 px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
