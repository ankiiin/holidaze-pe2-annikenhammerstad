const BASE_URL = "https://v2.api.noroff.dev";

export async function apiFetch (
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("accessToken");

    const headers = {
        "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch (`${BASE_URL}${endpoint}`, {
        ...options,
        headers,    
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
}