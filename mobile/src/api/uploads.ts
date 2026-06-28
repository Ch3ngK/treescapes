import { API_BASE_URL } from "./config";

export async function uploadEvidence(
    token: string, 
    imageUri: string
): Promise<{ url: string; storage_path: string }> {
    const formData = new FormData(); // FormData is the normal way to send files in a HTTP request. Since it is an image, do not send plain JSON here. 

    formData.append("file", {
        uri: imageUri, 
        name: "evidence.jpg",
        type: "image/jpeg",
    } as any);

    const response = await fetch(`${API_BASE_URL}/uploads/evidence`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    if (!response.ok) {
        throw new Error("Failed to upload image.");
    }

    return response.json();
}