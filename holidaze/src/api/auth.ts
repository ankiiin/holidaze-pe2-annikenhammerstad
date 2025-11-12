import { apiFetch } from "./client";

export async function loginUser(email: string, password: string) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("accessToken", data.accessToken);
    return data;
}