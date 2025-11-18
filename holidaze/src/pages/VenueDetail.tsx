import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "https://v2.api.noroff.dev";

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
  reviews?: Review[];
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = (localStorage.getItem("role") as "customer" | "manager" | null) ?? null;

  const isOwnerManager =
    role === "manager" && user && venue && user.name === venue.owner.name;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Venue[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    async function fetchVenue() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true&_reviews=true`
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        setVenue(json.data as Venue);
      } catch {
        setError("Could not load this venue.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSearchInput(value: string) {
    setSearchValue(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const res = await fetch(
      `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(value)}`
    );
    if (!res.ok) return;

    const json = await res.json();
    setSearchResults(json.data || []);
    setShowDropdown(true);
  }

  function openModal(index: number) {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function showPrev() {
    if (!venue?.media?.length) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? venue.media.length - 1 : prev - 1
    );
  }

  function showNext() {
    if (!venue?.media?.length) return;
    setActiveImageIndex((prev) =>
      prev === venue.media.length - 1 ? 0 : prev + 1
    );
  }

  if (loading) {
    return (
      <section className="animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="h-40 bg-gray-200 rounded-xl md:col-span-2" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
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

  const mainImage = media[0];
  const secondaryImages = media.slice(1, 3);

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          {media.length > 1 && (
            <>
              <button
                className="absolute left-6 text-white text-4xl font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
              >
                ‹
              </button>

              <button
                className="absolute right-6 text-white text-4xl font-bold"
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

        <div className="relative w-full max-w-sm" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-sm focus:ring-2 focus:ring-coral/40"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border shadow-lg rounded-lg z-40">
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

        <div className="md:hidden mb-4 relative">
          <img
            src={media[activeImageIndex].url}
            alt={venue.name}
            className="w-full h-64 object-cover rounded-xl"
            onClick={() => openModal(activeImageIndex)}
          />

          {media.length > 1 && (
            <>
              <button
                onClick={showPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ‹
              </button>

              <button
                onClick={showNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="hidden md:grid gap-4 md:grid-cols-[2fr,1fr]">
          <div
            className="rounded-xl overflow-hidden cursor-pointer"
            onClick={() => openModal(0)}
          >
            <img
              src={mainImage.url}
              alt={mainImage.alt || venue.name}
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="grid grid-rows-2 gap-4">
            {secondaryImages.map((img, index) => (
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

            {secondaryImages.length === 0 && (
              <div className="rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                More photos coming soon
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr,1.3fr]">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {venue.name}
            </h1>

            <p className="text-gray-600 mb-2 flex items-center gap-1">
              <span className="text-lg">📍</span>
              {venue.location?.city || "Unknown location"},{" "}
              {venue.location?.country || ""}
            </p>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <p className="text-lg font-semibold">${venue.price} per night</p>
              <p className="text-yellow-500 text-sm">
                {"⭐".repeat(Math.round(venue.rating || 0)) ||
                  "No rating yet"}
              </p>
              <p className="text-gray-500 text-sm">
                Max {venue.maxGuests}{" "}
                {venue.maxGuests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>

          <aside className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white h-fit">
            <h2 className="text-xl font-serif font-semibold mb-4">Your stay</h2>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Dates
                </label>

                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null];
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  minDate={new Date()}
                  placeholderText="Select your stay dates"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-coral/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Guests
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-coral/40">
                  {Array.from({ length: venue.maxGuests }, (_, i) => i + 1).map(
                    (g) => (
                      <option key={g} value={g}>
                        {g} {g === 1 ? "guest" : "guests"}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {token ? (
              <button
                onClick={() =>
                  navigate("/booking-confirmation", {
                    state: { venueId: venue.id, startDate, endDate },
                  })
                }
                className="w-full bg-azure text-white py-3 rounded-md font-semibold hover:bg-[#226964] transition mb-3"
              >
                Book now
              </button>
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
                className="w-full border border-teal text-teal py-2 rounded-md text-sm font-semibold hover:bg-teal hover:text-white transition"
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

        <div className="grid gap-10 md:grid-cols-[2fr,1.2fr]">
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {venue.description ||
                "No description provided for this venue yet."}
            </p>

            <h2 className="text-2xl font-serif font-semibold mt-10 mb-4">
              Rules & policies
            </h2>

            <div className="grid grid-cols-2 text-sm text-gray-700 gap-y-2">
              <p>• Check in 15:00</p>
              <p>• Check out 11:00</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-2">
              {venue.meta?.wifi && (
                <span className="px-3 py-1 bg-teal/5 text-teal text-sm rounded-full border border-teal/20">
                  Wi-Fi
                </span>
              )}
              {venue.meta?.parking && (
                <span className="px-3 py-1 bg-teal/5 text-teal text-sm rounded-full border border-teal/20">
                  Parking
                </span>
              )}
              {venue.meta?.breakfast && (
                <span className="px-3 py-1 bg-teal/5 text-teal text-sm rounded-full border border-teal/20">
                  Breakfast
                </span>
              )}
              {venue.meta?.pets && (
                <span className="px-3 py-1 bg-teal/5 text-teal text-sm rounded-full border border-teal/20">
                  Pets allowed
                </span>
              )}
              {!venue.meta ||
                (!venue.meta.wifi &&
                  !venue.meta.parking &&
                  !venue.meta.breakfast &&
                  !venue.meta.pets && (
                    <p className="text-gray-500 text-sm">
                      Amenities information is not available.
                    </p>
                  ))}
            </div>
          </section>
        </div>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-serif font-bold mb-10">Reviews</h2>

          {!venue.reviews || venue.reviews.length === 0 ? (
            <p className="text-gray-500 italic">
              No reviews yet for this venue.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {venue.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white shadow-sm border border-gray-100 rounded-xl p-8"
                >
                  <p className="italic text-gray-600 mb-4">
                    "{review.description}"
                  </p>

                  <p className="font-semibold text-teal mb-1">
                    {review.user?.name || "Unknown guest"}
                  </p>

                  <p className="text-yellow-500 text-sm">
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