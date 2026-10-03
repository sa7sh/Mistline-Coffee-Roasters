import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiErrorMessage, readApiError } from "../apiError";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function redirectIfSignedIn() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          navigate("/admin");
          return;
        }
        localStorage.removeItem("token");
      } catch {
        // Keep the form on screen if the check cannot reach the API.
      }
    }

    redirectIfSignedIn();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      if (!response.ok) {
        throw new Error(await readApiError(response, "Could not log in"));
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not log in"));
      setStatus("idle");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Roastery desk</p>
      <h1 className="mt-3 font-serif text-5xl text-stone-900">Admin login</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm text-stone-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
            required
          />
        </label>
        {error ? <p className="text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-stone-900 px-6 py-3 text-sm text-white disabled:opacity-60"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;