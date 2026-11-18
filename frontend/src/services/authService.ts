import type {
    AccountResponse,
    AuthResponse,
    LoginRequest,
} from "../types/auth";

const API_URL = (
    import.meta.env.VITE_API_URL ?? "http://localhost:8081"
).replace(/\/+$/, "");

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export async function login(
    credentials: LoginRequest
): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const message =
            response.status === 401
                ? "Email ou mot de passe incorrect."
                : response.status === 400
                    ? "Vérifie les informations saisies."
                    : "La connexion a échoué. Réessaie plus tard.";

        throw new ApiError(response.status, message);
    }

    const data: AuthResponse = await response.json();

    if (!data.accessToken || !data.user) {
        throw new Error("La réponse du serveur ne contient pas de token valide.");
    }

    return data;
}

export async function getMyAccount(
    accessToken: string
): Promise<AccountResponse> {
    const response = await fetch(`${API_URL}/api/account/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new ApiError(
            response.status,
            response.status === 401
                ? "Session expirée ou token invalide. Reconnecte-toi."
                : "Impossible de récupérer le compte."
        );
    }

    return response.json();
}