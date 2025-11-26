// src/pages/EditVenue.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [pool, setPool] = useState(false);
  const [breakfast, setBreakfast] = useState(false);

  // Fetch existing venue
  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
          headers: { "X-Noroff-API-Key": API_KEY },
        });

        if (!res.ok) throw new Error("Failed to load venue");

        const json = await res.json();
        const v = json.data;

        // Prefill all fields
        setName(v.name);
        setDescription(v.description);
        setPrice(v.price);
        setMaxGuests(v.maxGuests);
        setImageUrl(v.media?.[0]?.url || "");
        setCity(v.location?.city || "");
        setCountry(v.location?.country || "");

        setWifi(v.meta?.wifi || false);
        setParking(v.meta?.parking || false);
        setPool(v.meta?.pool || false);
        setBreakfast(v.meta?.breakfast || false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          maxGuests: Number(maxGuests),
          media: imageUrl ? [{ url: imageUrl, alt: name }] : [],
          location: { city, country },
          meta: { wifi, parking, pool, breakfast },
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to update venue");

      navigate(`/venue/${id}`, { state: { updated: true } });
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-center py-12">Loading venue…</p>;

  return (
    <section className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-6">Edit venue</h1>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Price per night</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Max guests</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Image URL</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Country</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="font-semibold mb-2">Amenities</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
            Wifi
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />
            Parking
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pool} onChange={(e) => setPool(e.target.checked)} />
            Pool
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} />
            Breakfast
          </label>
        </fieldset>

        <button className="bg-teal text-white px-6 py-2 rounded hover:bg-teal/90 transition">
          Save changes
        </button>
      </form>
    </section>
  );
}