import { API_BASE_URL } from "./config"

export type LoginRequest = {
    email: string;
    password: string; 
};

export type TokenResponse = {
    access_token: string; 
    token_type: string; 
};

export async function loginRequest(payload: LoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password"); 
    }

    return response.json();
}