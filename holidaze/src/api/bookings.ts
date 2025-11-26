const API_BASE = "https://v2.api.noroff.dev";

export async function getUserBookings(userName: string, token: string, apiKey: string) {
  const res = await fetch(`${API_BASE}/holidaze/profiles/${userName}/bookings?_venue=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");

  return json.data || [];
}