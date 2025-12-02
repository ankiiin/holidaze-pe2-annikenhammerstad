import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

interface VenueMeta {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
}

interface VenueLocation {
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

interface VenueMediaItem {
  url: string;
  alt?: string;
}

interface VenueOwner {
  name: string;
  email: string;
  avatar?: {
    url?: string;
    alt?: string;
  };
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
}

interface Review {
  id: string;
  rating: number;
  description: string;
  user: {
    name: string;
  };
}

interface Venue {
  id: string;
  name: string;
  description?: string;
  price: number;
  rating: number;
  maxGuests: number;
  media: VenueMediaItem[];
  meta?: VenueMeta;
  location?: VenueLocation;
  owner: VenueOwner;
  bookings: Booking[];
  reviews?: Review[];
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isOwnerManager =
    role === "manager" && user && venue && venue.owner?.name === user.name;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function loadVenue() {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true&_reviews=true`,
          {
            headers: { "X-Noroff-API-Key": API_KEY },
          }
        );

        if (!res.ok) throw new Error("Failed to load venue");

        const json = await res.json();
        setVenue(json.data as Venue);
      } catch {
        toast.error("Could not load this venue.");
        setError("COuld not load this venue.");
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  const bookedRanges =
    venue?.bookings?.map((b) => ({
      start: new Date(b.dateFrom),
      end: new Date(b.dateTo),
    })) || [];

  function isDateBooked(date: Date) {
    return bookedRanges.some(
      (range) => date >= range.start && date <= range.end
    );
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSearchInput(value: string) {
    setSearchValue(value);

    if (!value.trim()) {
      setShowDropdown(false);
      return;
    }

    const res = await fetch(
      `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(value)}`,
      { headers: { "X-Noroff-API-Key": API_KEY } }
    );

    if (!res.ok) return;

    const json = await res.json();
    setSearchResults(json.data || []);
    setShowDropdown(true);
  }

  function openModal(idx: number) {
    setActiveImageIndex(idx);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function showPrev() {
    if (!venue?.media.length) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? venue.media.length - 1 : prev - 1
    );
  }

  function showNext() {
    if (!venue?.media.length) return;
    setActiveImageIndex((prev) =>
      prev === venue.media.length - 1 ? 0 : prev + 1
    );
  }

  async function submitBooking() {
    if (!token) {
      toast.error("You need to log in before booking.");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select valid dates.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/holidaze/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateFrom: startDate,
          dateTo: endDate,
          guests,
          venueId: id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create booking.");

      const json = await res.json();

      navigate("/booking-confirmation", {
        state: {
          bookingId: json.data.id,
          venueId: id,
          startDate,
          endDate,
        },
      });
    } catch (err) {
      toast.error("Could not complete booking. Please try again.");
    }
  }

  if (loading) {
    return (
      <section className="animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </section>
    );
  }

  if (error || !venue) {
    return (
      <section className="text-center py-16">
        <h1 className="text-2xl font-serif font-bold mb-4">Venue not found</h1>
        <Link to="/venues" className="text-coral underline font-semibold">
          Back to Explore
        </Link>
      </section>
    );
  }

  const media = venue.media?.length
    ? venue.media
    : [{ url: "/images/placeholder.jpg", alt: venue.name }];

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center"
          onClick={closeModal}
        >
          {media.length > 1 && (
            <>
              <button
                className="absolute left-6 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-6 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
              >
                ›
              </button>
            </>
          )}

          <img
            src={media[activeImageIndex].url}
            alt={venue.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="space-y-10">
        <div className="relative max-w-sm" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-sm"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          {showDropdown && (
            <div className="absolute mt-1 w-full bg-white border shadow-lg rounded-lg z-50">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/venue/${item.id}`)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 text-left"
                >
                  <img
                    src={item.media?.[0]?.url || "/images/placeholder.jpg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.location?.city || "Unknown"},{" "}
                      {item.location?.country || ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div
            className="rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openModal(0)}
          >
            <img
              src={media[0].url}
              alt={media[0].alt || venue.name}
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="grid grid-rows-2 gap-4">
            {media.slice(1, 3).map((img, index) => (
              <div
                key={index + 1}
                className="rounded-xl overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${venue.name} image ${index + 2}`}
                  className="w-full h-36 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr,1.3fr]">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-3">{venue.name}</h1>

            <p className="text-gray-600 mb-4">
              📍 {venue.location?.city || "Unknown"},{" "}
              {venue.location?.country || ""}
            </p>

            <p className="text-lg font-semibold mb-2">
              ${venue.price} per night
            </p>

            <p className="text-gray-500 text-sm mb-6">
              Max {venue.maxGuests} {venue.maxGuests === 1 ? "guest" : "guests"}
            </p>

            <h2 className="text-xl font-serif font-semibold mb-2">
              About this place
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {venue.description || "No description provided."}
            </p>
          </div>

          <aside className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white h-fit">
            <h2 className="text-xl font-serif font-semibold mb-4">Your stay</h2>

            <div className="space-y-3 mb-4">
              <label className="block text-xs font-semibold text-gray-500">
                Dates
              </label>

              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates as [Date | null, Date | null];
                  if (start && isDateBooked(start)) return;
                  if (end && isDateBooked(end)) return;

                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                minDate={new Date()}
                filterDate={(date) => !isDateBooked(date)}
                placeholderText="Select your stay dates"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Array.from({ length: venue.maxGuests }, (_, i) => i + 1).map(
                  (g) => (
                    <option key={g} value={g}>
                      {g} {g === 1 ? "guest" : "guests"}
                    </option>
                  )
                )}
              </select>
            </div>

            {token ? (
              isOwnerManager ? (
                <p className="text-sm text-gray-500 italic">
                  Managers cannot book their own venues.
                </p>
              ) : (
                <button
                  onClick={submitBooking}
                  className="w-full bg-azure text-white py-3 rounded-md font-semibold hover:bg-[#226964] transition"
                >
                  Book now
                </button>
              )
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                You must{" "}
                <Link
                  to="/login"
                  className="text-coral underline font-semibold"
                >
                  log in
                </Link>{" "}
                before booking.
              </p>
            )}

            {isOwnerManager && (
              <button
                onClick={() => navigate(`/edit/${venue.id}`)}
                className="mt-3 w-full border border-teal text-teal py-2 rounded-md text-sm font-semibold hover:bg-teal hover:text-white transition"
              >
                Edit venue
              </button>
            )}

            <div className="mt-4 border-t pt-3 text-xs text-gray-500">
              Hosted by{" "}
              <span className="font-semibold text-gray-700">
                {venue.owner.name}
              </span>
            </div>
          </aside>
        </div>

        <section className="py-12">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">
            Reviews
          </h2>

          {!venue.reviews || venue.reviews.length === 0 ? (
            <p className="text-gray-500 italic text-center">No reviews yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {venue.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white shadow-sm border border-gray-100 rounded-xl p-6"
                >
                  <p className="italic mb-3 text-gray-600">
                    "{review.description}"
                  </p>
                  <p className="font-semibold text-teal">{review.user?.name}</p>
                  <p className="text-yellow-500">
                    {"⭐".repeat(review.rating)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
