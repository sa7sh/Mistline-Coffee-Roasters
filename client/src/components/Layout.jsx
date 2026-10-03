import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/useCart";

function Layout() {
  const { count } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5">
          <Link to="/" className="font-serif text-2xl tracking-tight">
            Mistline
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm tracking-wide">
            <Link to="/products" className="text-stone-700 hover:text-stone-900">
              Coffees
            </Link>
            <Link to="/bag" className="text-stone-700 hover:text-stone-900">
              Bag{count > 0 ? ` (${count})` : ""}
            </Link>
            <Link to="/admin/login" className="text-stone-700 hover:text-stone-900">
              Admin
            </Link>
          </div>
        </nav>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg text-stone-900">Mistline</p>
          <p>Grown in the mist. Roasted in small lots.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
