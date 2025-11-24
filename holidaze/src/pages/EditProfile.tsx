import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://v2.api.noroff.dev";

export default function EditProfile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const token = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_KEY as string;

  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || "");
  const [avatarAlt, setAvatarAlt] = useState(
    user?.avatar?.alt || "Profile picture"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/holidaze/profiles/${user.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          name,
          avatar: {
            url: avatarUrl,
            alt: avatarAlt,
          },
          venueManager: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.errors?.[0]?.message || "Could not update profile"
        );
      }

      localStorage.setItem("user", JSON.stringify(data.data));

      navigate("/profile", { state: { updated: true } });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <section className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif font-bold mb-6">Edit profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Avatar URL</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Avatar ALT text
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-azure text-white px-6 py-2 rounded-md hover:bg-[#226964] transition"
        >
          Save changes
        </button>
      </form>
    </section>
  );
}