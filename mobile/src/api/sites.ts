import { API_BASE_URL } from "./config";

export type Site = {
    id: number;
    name: string; 
    code: string | null;
    address: string | null;
    management_company_id: number;
};

export async function getSites(token: string): Promise<Site[]> {
    const response = await fetch(`${API_BASE_URL}/sites`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load sites.");
    }

    return response.json();
}