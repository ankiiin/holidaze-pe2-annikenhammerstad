import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

export default function CreateVenue() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [location, setLocation] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [pool, setPool] = useState(false);
  const [breakfast, setBreakfast] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token || !API_KEY || !user) {
      setError("Missing authentication.");
      return;
    }

    if (!name || !description || !price || !maxGuests) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/holidaze/venues`, {
        method: "POST",
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
          media: mediaUrl ? [{ url: mediaUrl, alt: name }] : [],
          location: {
            address: "",
            city: location.split(",")[0]?.trim() || "",
            country: location.split(",")[1]?.trim() || "",
          },
          meta: {
            wifi,
            parking,
            pool,
            breakfast,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Could not create venue.");
      }

      navigate(`/manager`);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <section className="max-w-lg mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">
        Create new venue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border">
        
        {/* NAME */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Enter venue name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-28"
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* MEDIA */}
        <div>
          <label className="block text-sm font-semibold mb-1">Media (image URL)</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Upload image URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>

        {/* PRICE + GUESTS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Price per night
            </label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g. 150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Max guests</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="e.g. 4"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-semibold mb-1">Location</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="City, Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* AMENITIES */}
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={wifi} onChange={() => setWifi(!wifi)} />
            Wifi
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={parking} onChange={() => setParking(!parking)} />
            Parking
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={pool} onChange={() => setPool(!pool)} />
            Pool
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={breakfast} onChange={() => setBreakfast(!breakfast)} />
            Breakfast
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* BUTTONS */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-coral text-white px-6 py-2 rounded-md font-semibold hover:bg-[#e15e52] transition"
          >
            Save venue
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </section>
  );
}