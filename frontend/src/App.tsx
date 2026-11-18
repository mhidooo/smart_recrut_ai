import { useState } from "react";
import Login from "./pages/Login";
import { ApiError, getMyAccount } from "./services/authService";
import type { AccountResponse, AuthResponse } from "./types/auth";
import "./App.css";

export default function App() {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(response: AuthResponse) {
    setAuth(response);
    setAccount(null);
    setError("");
  }

  function logout() {
    setAuth(null);
    setAccount(null);
    setError("");
  }

  async function checkProtectedRoute() {
    if (!auth) return;

    setLoading(true);
    setError("");
    setAccount(null);

    try {
      const response = await getMyAccount(auth.accessToken);
      setAccount(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
      }

      setError(
          error instanceof TypeError
              ? "Impossible de contacter le backend."
              : error instanceof Error
                  ? error.message
                  : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className="app-shell">
        {!auth ? (
            <>
              <Login onLogin={handleLogin} />

              {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
              )}
            </>
        ) : (
            <section className="auth-card">
              <h1>SmartRecruit AI</h1>
              <h2>Bienvenue, {auth.user.fullName}</h2>

              <p>Email : {auth.user.email}</p>
              <p>Rôle : {auth.user.role}</p>

              <div className="actions">
                <button
                    type="button"
                    onClick={() => void checkProtectedRoute()}
                    disabled={loading}
                >
                  {loading ? "Vérification..." : "Tester mon accès sécurisé"}
                </button>

                <button
                    type="button"
                    className="secondary"
                    onClick={logout}
                    disabled={loading}
                >
                  Se déconnecter
                </button>
              </div>

              {account && (
                  <div className="account-result" role="status">
                    <p>Accès à la route protégée réussi.</p>
                    <p>Identifiant : {account.userId}</p>
                    <p>Rôles : {account.roles.join(", ")}</p>
                  </div>
              )}

              {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
              )}
            </section>
        )}
      </main>
  );
}