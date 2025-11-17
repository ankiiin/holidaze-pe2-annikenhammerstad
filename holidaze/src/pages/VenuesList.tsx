import { useEffect, useState } from "react";
import type { Venue } from "../types/venue";

const API_BASE = "https://v2.api.noroff.dev";

type SortOption = "popular" | "priceLow" | "priceHigh" | "rating";

export default function VenuesList() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues(search?: string) {
    setLoading(true);
    setErrorMsg("");

    try {
      const endpoint = search
        ? `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(search)}`
        : `${API_BASE}/holidaze/venues`;

      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`Failed to fetch venues (${res.status})`);
      }

      const data = await res.json();
      setVenues(data.data || []);
    } catch (error) {
      console.error(error);
      setErrorMsg("Could not load venues. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchVenues(searchTerm.trim() || undefined);
  }

  const guestsNumber = Number(guests) || 1;

  const filtered = venues.filter((venue) =>
    venue.maxGuests ? venue.maxGuests >= guestsNumber : true
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case "priceLow":
        return (a.price || 0) - (b.price || 0);
      case "priceHigh":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <form
        onSubmit={handleSearch}
        className="mt-4 md:mt-8 flex flex-col md:flex-row gap-4 md:gap-3 items-stretch md:items-center"
      >
        <div className="flex-1">
          <label className="sr-only" htmlFor="search">
            Search destinations
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search destinations..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-40">
          <label className="sr-only" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="w-full md:w-40">
          <label className="sr-only" htmlFor="guests">
            Guests
          </label>
          <select
            id="guests"
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5">5+ guests</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full md:w-28 bg-teal text-white text-sm font-semibold py-2 rounded-md hover:bg-teal/90 transition"
        >
          Search
        </button>
      </form>

      <div className="flex justify-end text-[11px] text-gray-500 gap-2 md:gap-3">
        <span>Sort by</span>
        <button
          type="button"
          onClick={() => setSortOption("popular")}
          className={`underline-offset-2 ${
            sortOption === "popular"
              ? "font-semibold text-teal underline"
              : "hover:text-teal"
          }`}
        >
          Most popular
        </button>
        <span>|</span>
        <button
          type="button"
          onClick={() => setSortOption("priceLow")}
          className={`underline-offset-2 ${
            sortOption === "priceLow"
              ? "font-semibold text-teal underline"
              : "hover:text-teal"
          }`}
        >
          Price
        </button>
        <button
          type="button"
          onClick={() => setSortOption("rating")}
          className={`underline-offset-2 ${
            sortOption === "rating"
              ? "font-semibold text-teal underline"
              : "hover:text-teal"
          }`}
        >
          Rating
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-500">Loading venues…</p>}
      {errorMsg && (
        <p className="text-center text-sm text-red-600">{errorMsg}</p>
      )}

      {!loading && !errorMsg && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((venue) => {
            const imageUrl =
              venue.media && venue.media.length > 0
                ? venue.media[0].url
                : "/placeholder.png";

            const location =
              venue.location?.city && venue.location?.country
                ? `${venue.location.city}, ${venue.location.country}`
                : venue.location?.country ||
                  venue.location?.city ||
                  "Unknown location";

            const ratingStars = venue.rating
              ? "⭐".repeat(Math.round(venue.rating))
              : "";

            return (
              <article
                key={venue.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={venue.media?.[0]?.alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col gap-1 flex-1">
                  <h3 className="font-serif text-lg font-semibold">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-gray-500">{location}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-teal">
                        ${venue.price} per night
                      </p>
                      {ratingStars && (
                        <p className="text-xs text-yellow-500">
                          {ratingStars}
                        </p>
                      )}
                    </div>

                    <button className="bg-teal text-white text-xs font-semibold py-2 px-4 rounded-md hover:bg-teal/90 transition">
                      Book now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {sorted.length === 0 && !loading && !errorMsg && (
            <p className="col-span-full text-center text-sm text-gray-500">
              No venues found. Try adjusting your search.
            </p>
          )}
        </section>
      )}
    </div>
  );
}