const API_BASE = "https://v2.api.noroff.dev";

export async function getFeaturedVenues(limit = 3) {
  try {
    const response = await fetch(`${API_BASE}/holidaze/venues?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}

export async function getVenueReviews(id: string) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/holidaze/venues/${id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch venue details: ${response.status}`);
    }

    const data = await response.json();

    const reviews = data.data?.reviews || [];
    if (reviews.length === 0) {
      return [
        {
          rating: 5,
          description:
            "An unforgettable experience — stunning views and peaceful atmosphere 🌅",
          user: { name: "AmalieTraveler" },
        },
        {
          rating: 4,
          description:
            "Lovely host and clean rooms! Great location near the beach 🏖️",
          user: { name: "JonasExplorer" },
        },
        {
          rating: 5,
          description:
            "The perfect weekend getaway. Beautiful interior and cozy vibe ✨",
          user: { name: "MajaAdventurer" },
        },
      ];
    }

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
