import { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export default function Health() {
    const [message, setMessage] = useState("Connexion au backend...");

    useEffect(() => {
        const controller = new AbortController();

        async function checkBackend() {
            try {
                const response = await fetch(`${API_URL}/api/health`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }

                const text = await response.text();
                setMessage(text);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("Erreur de connexion au backend :", error);

                setMessage(
                    error instanceof Error
                        ? `Erreur : ${error.message}`
                        : "Une erreur inconnue est survenue"
                );
            }
        }

        void checkBackend();

        return () => controller.abort();
    }, []);

    return (
        <main>
            <h1>SmartRecruit AI</h1>
            <h2>État du backend</h2>
            <p>{message}</p>
        </main>
    );
}