import { fetch } from "expo/fetch";
import { File } from "expo-file-system";

import { API_BASE_URL } from "./config";

export async function uploadEvidence(
    token: string, 
    imageUri: string
): Promise<{ url: string; storage_path: string }> {
    const file = new File(imageUri);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/uploads/evidence`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload image.");
    }

    return response.json();
}
