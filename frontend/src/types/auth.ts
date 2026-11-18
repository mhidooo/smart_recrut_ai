export type UserRole = "CANDIDATE" | "RECRUITER" | "ADMIN";

export interface User {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface AccountResponse {
    userId: string;
    roles: UserRole[];
}