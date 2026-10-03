import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Mistline</p>
      <h1 className="mt-3 font-serif text-5xl text-stone-900">Page not found</h1>
      <p className="mt-4 max-w-md text-stone-600">
        That address is not part of the roastery. The coffees are still here.
      </p>
      <Link
        to="/products"
        className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
      >
        Browse coffees
      </Link>
    </main>
  );
}

export default NotFoundPage;
