import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);

  useEffect(() => {
    if (location.state?.updated) {
      setShowUpdatedMessage(true);
      const timer = setTimeout(() => setShowUpdatedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
      {showUpdatedMessage && (
        <div className="mb-6 w-full bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm">
          Profile updated successfully!
        </div>
      )}

      <h1 className="text-3xl font-serif font-bold mb-8">Your profile</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
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

      <div className="mt-12">
        <h2 className="text-xl font-serif font-semibold mb-4">
          Your venues & bookings
        </h2>
        <p className="text-gray-600 text-sm">
          This section can later display bookings or manager-owned venues depending on role.
        </p>
      </div>
    </section>
  );
}