import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state;

  const role = localStorage.getItem("role"); 

  useEffect(() => {
    if (!booking) {
      navigate("/venues");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { venueId, startDate, endDate } = booking;

  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function goToBookings() {
    if (role === "manager") {
      navigate("/manager");
    } else {
      navigate("/profile");
    }
  }

  return (
    <section className="max-w-lg mx-auto py-16 px-6 text-center">
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl shadow-sm mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Booking confirmed!</h1>
        <p className="text-sm">Your stay has been successfully booked.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-serif font-semibold mb-4">Your booking details</h2>

        <div className="text-left space-y-3">
          <p>
            <span className="font-semibold">Venue:</span>{" "}
            <Link
              to={`/venue/${venueId}`}
              className="text-teal hover:text-coral font-medium"
            >
              View venue
            </Link>
          </p>

          <p>
            <span className="font-semibold">From:</span> {formatDate(startDate)}
          </p>
          <p>
            <span className="font-semibold">To:</span> {formatDate(endDate)}
          </p>
        </div>
      </div>

      <button
        onClick={goToBookings}
        className="bg-azure text-white px-6 py-3 rounded-md font-semibold hover:bg-[#226964] transition"
      >
        Go back to My Bookings
      </button>
    </section>
  );
}