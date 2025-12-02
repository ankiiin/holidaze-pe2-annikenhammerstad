import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserBookings } from "../api/bookings";
import toast from "react-hot-toast";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

interface ManagerVenueLocation {
  city?: string | null;
  country?: string | null;
}

interface ManagerVenueMedia {
  url: string;
  alt?: string;
}

interface ManagerVenue {
  id: string;
  name: string;
  location?: ManagerVenueLocation;
  media?: ManagerVenueMedia[];
}

interface ManagerBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: ManagerVenue;
}

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<ManagerBooking[]>([]);
  const [venues, setVenues] = useState<ManagerVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!user || role !== "manager") {
      navigate("/profile");
      return;
    }

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [venueRes, bookingRes] = await Promise.all([
          fetch(`${API_BASE}/holidaze/profiles/${user.name}/venues`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }),
          fetch(`${API_BASE}/holidaze/profiles/${user.name}/bookings?_venue=true`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }),
        ]);

        if (!venueRes.ok || !bookingRes.ok) {
          throw new Error("Could not load dashboard data.");
        }

        const venueData = await venueRes.json();
        const bookingData = await bookingRes.json();

        const sortedBookings = (bookingData.data || []).sort((a: any, b: any) =>
          a.dateFrom.localeCompare(b.dateFrom)
        );

        setVenues(venueData.data || []);
        setBookings(sortedBookings);
      } catch (err: any) {
        toast.error(err.message || "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [navigate]); 

  async function handleDeleteVenue(id: string) {
    const token = localStorage.getItem("token");

    const confirmed = window.confirm("Are you sure you want to delete this venue?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Could not delete venue.");

      setVenues((prev) => prev.filter((v) => v.id !== id));
      toast.success("Venue deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Could not delete venue.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return null;

  return (
    <section className="max-w-6xl mx-auto py-12 px-6">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border shadow-sm">
            <img
              src={user.avatar?.url || "/images/avatar-placeholder.png"}
              alt={user.avatar?.alt || "Profile picture"}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-3xl font-serif font-bold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <Link
          to="/create"
          className="bg-coral text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#da5b4f] transition"
        >
          Create new venue
        </Link>
      </div>

      <h1 className="text-3xl font-serif font-bold text-center mb-10">
        Welcome back, {user.name.split(" ")[0]}!
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white shadow-sm border rounded-2xl p-6">
          <h2 className="text-2xl font-serif font-semibold mb-4">Upcoming bookings</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming bookings.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b">
                  <th className="py-2">Guests</th>
                  <th className="py-2">Venue</th>
                  <th className="py-2">Dates</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-none">
                    <td className="py-3">{b.guests} guests</td>
                    <td className="py-3">
                      <Link to={`/venue/${b.venue.id}`} className="text-teal hover:text-coral font-semibold">
                        {b.venue.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {b.venue.location?.city}, {b.venue.location?.country}
                      </p>
                    </td>
                    <td className="py-3">
                      {formatDate(b.dateFrom)} – {formatDate(b.dateTo)}
                    </td>
                    <td className="py-3 text-green-600 text-xs font-semibold">Confirmed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white shadow-sm border rounded-2xl p-6">
          <h2 className="text-2xl font-serif font-semibold mb-4">My venues</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : venues.length === 0 ? (
            <p className="text-sm text-gray-500">
              No venues yet.{" "}
              <Link to="/create" className="text-coral underline">Create one</Link>
            </p>
          ) : (
            <div className="space-y-4">
              {venues.map((venue) => {
                const img = venue.media?.[0]?.url || "/images/placeholder.jpg";

                return (
                  <div key={venue.id} className="flex gap-4 border-b pb-4 last:border-none">
                    <Link to={`/venue/${venue.id}`} className="w-20 h-16 rounded-lg overflow-hidden">
                      <img src={img} alt={venue.name} className="w-full h-full object-cover" />
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/venue/${venue.id}`}
                        className="text-teal hover:text-coral font-semibold text-sm"
                      >
                        {venue.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {venue.location?.city || "Unknown"}, {venue.location?.country || ""}
                      </p>

                      <div className="mt-2 flex gap-3 text-xs text-teal font-semibold">
                        <Link to={`/edit/${venue.id}`} className="hover:underline">Edit</Link>
                        <button
                          onClick={() => handleDeleteVenue(venue.id)}
                          disabled={deletingId === venue.id}
                          className="text-red-500 hover:underline disabled:opacity-50"
                        >
                          {deletingId === venue.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}