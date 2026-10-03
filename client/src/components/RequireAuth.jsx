import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const [status, setStatus] = useState(() =>
    localStorage.getItem("token") ? "loading" : "denied",
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    let cancelled = false;

    async function checkToken() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (cancelled) {
          return;
        }
        if (!response.ok) {
          localStorage.removeItem("token");
          setStatus("denied");
          return;
        }
        setStatus("allowed");
      } catch {
        if (!cancelled) {
          setStatus("denied");
        }
      }
    }

    checkToken();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <p className="p-8 text-stone-600">Checking login...</p>;
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default RequireAuth;