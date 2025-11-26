import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserBookings } from "../api/bookings";

export default function Profile() {
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const token = localStorage.getItem("token");
  const apiKey = import.meta.env.VITE_API_KEY;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);

  // Show "profile updated" toast
  useEffect(() => {
    if (location.state?.updated) {
      setShowUpdatedMessage(true);
      const timer = setTimeout(() => setShowUpdatedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch user bookings
  useEffect(() => {
    async function loadBookings() {
      if (!user || !token || !apiKey) return;

      try {
        const data = await getUserBookings(user.name, token, apiKey);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user, token, apiKey]);

  if (!user) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Not logged in</h1>
        <p className="text-gray-600 mb-4">
          You need to log in to view your profile.
        </p>
        <Link to="/login" className="text-coral font-semibold underline">
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      {/* SUCCESS MESSAGE */}
      {showUpdatedMessage && (
        <div className="mb-6 w-full bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm">
          Profile updated successfully!
        </div>
      )}

      {/* HEADER */}
      <h1 className="text-3xl font-serif font-bold mb-8">Your profile</h1>

      {/* PROFILE INFO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={user.avatar?.url || "/images/avatar-placeholder.png"}
            alt={user.avatar?.alt || "Profile picture"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-lg font-semibold mb-1">{user.name}</p>
          <p className="text-gray-600 mb-4">{user.email}</p>

          <Link
            to="/edit-profile"
            className="inline-block bg-azure text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#226964] transition"
          >
            Edit profile
          </Link>
        </div>
      </div>

      {/* BOOKINGS SECTION */}
      <h2 className="text-xl font-serif font-semibold mb-4">Your bookings</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading your bookings…</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600 text-sm italic">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <Link
                to={`/venues/${booking.venue.id}`}
                className="font-semibold text-teal hover:text-coral"
              >
                {booking.venue.name}
              </Link>

              <p className="text-sm text-gray-600">
                {booking.venue.location?.city},{" "}
                {booking.venue.location?.country}
              </p>

              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Dates:</span>{" "}
                {new Date(booking.dateFrom).toLocaleDateString("en-GB")} –{" "}
                {new Date(booking.dateTo).toLocaleDateString("en-GB")}
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Guests:</span>{" "}
                {booking.guests}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}