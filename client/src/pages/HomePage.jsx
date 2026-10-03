import { Link } from "react-router-dom";
import heroImage from "../assets/mistline-morning.jpg";

const origins = [
  {
    name: "Chikmagalur",
    text: "High slopes in Karnataka, where Indian coffee growing began.",
  },
  {
    name: "Coorg",
    text: "Shaded estates in Kodagu, with honeyed and spiced cups.",
  },
  {
    name: "Araku",
    text: "Valley lots from the Eastern Ghats, often soft and chocolatey.",
  },
];

function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
            Small-batch roaster
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-stone-900 sm:text-6xl">
            Mistline Coffee Roasters
          </h1>
          <p className="mt-5 text-xl text-stone-700">
            Grown in the mist. Roasted in small lots.
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-stone-600">
            Single-origin coffees from three Indian estate regions, sold as
            whole-bean bags. Every bag lists the origin, roast, and tasting
            notes.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm tracking-wide text-white"
          >
            Shop the coffees
          </Link>
        </div>
        <img
          src={heroImage}
          alt="Roasted coffee beans"
          className="h-[28rem] w-full rounded-3xl object-cover"
        />
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-serif text-3xl text-stone-900">Three origins</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {origins.map((origin) => (
            <li
              key={origin.name}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <h3 className="font-serif text-2xl text-stone-900">{origin.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {origin.text}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default HomePage;
