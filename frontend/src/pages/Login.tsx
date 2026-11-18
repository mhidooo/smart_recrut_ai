import { useState } from "react";
import { login } from "../services/authService";
import type { AuthResponse } from "../types/auth";

interface LoginProps {
    onLogin: (auth: AuthResponse) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submitLogin() {
        setError("");
        setLoading(true);

        try {
            const auth = await login({
                email: email.trim(),
                password,
            });

            setPassword("");
            onLogin(auth);
        } catch (error) {
            setError(
                error instanceof TypeError
                    ? "Impossible de contacter le serveur. Vérifie le backend et CORS."
                    : error instanceof Error
                        ? error.message
                        : "Une erreur est survenue."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-card">
            <h1>SmartRecruit AI</h1>
            <h2>Connexion</h2>
            <p>Connecte-toi pour accéder à ton espace.</p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void submitLogin();
                }}
            >
                <label htmlFor="email">Adresse email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    maxLength={254}
                    disabled={loading}
                />

                <label htmlFor="password">Mot de passe</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    maxLength={72}
                    disabled={loading}
                />

                {error && (
                    <p className="error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </section>
    );
}