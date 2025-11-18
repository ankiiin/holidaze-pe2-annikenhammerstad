import { useEffect, useState } from "react";
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
  const role =
    (localStorage.getItem("role") as "customer" | "manager" | null) ?? null;

  const isOwnerManager =
    role === "manager" && user && venue && user.name === venue.owner.name;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [searchValue, setSearchValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchVenue() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true&_reviews=true`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch venue (${res.status})`);
        }

        const json = await res.json();
        setVenue(json.data as Venue);
      } catch (err: any) {
        console.error("Error fetching venue:", err);
        setError("Could not load this venue. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  function handleTopSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    navigate("/venues", { state: { search: query } });
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

  if (error) {
    return (
      <section className="text-center py-16">
        <h1 className="text-2xl font-serif font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-azure text-white rounded-lg hover:bg-[#226964] transition"
        >
          Go back
        </button>
      </section>
    );
  }

  if (!venue) {
    return (
      <section className="text-center py-16">
        <h1 className="text-2xl font-serif font-bold mb-4">Venue not found</h1>
        <Link to="/venues" className="text-coral font-semibold underline">
          Back to Explore
        </Link>
      </section>
    );
  }

  const media: VenueMediaItem[] =
    venue.media && venue.media.length > 0
      ? venue.media
      : [{ url: "/images/placeholder.jpg", alt: venue.name }];

  const mainImage = media[0];
  const secondaryImages = media.slice(1, 3);
  const totalImages = media.length;

  function openModal(index: number) {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function showPrev() {
    setActiveImageIndex((prev) =>
      prev === 0 ? totalImages - 1 : prev - 1
    );
  }

  function showNext() {
    setActiveImageIndex((prev) =>
      prev === totalImages - 1 ? 0 : prev + 1
    );
  }

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            aria-label="Close image viewer"
          >
            ×
          </button>

          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 md:left-8 text-white text-3xl md:text-4xl px-2"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 md:right-8 text-white text-3xl md:text-4xl px-2"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <img
            src={media[activeImageIndex].url}
            alt={
              media[activeImageIndex].alt || `${venue.name} image ${activeImageIndex + 1}`
            }
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="space-y-10">
        <form
          onSubmit={handleTopSearch}
          className="mb-4 flex justify-start"
          aria-label="Search destinations"
        >
          <div className="w-full max-w-sm">
            <label htmlFor="venue-detail-search" className="sr-only">
              Search destinations
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                id="venue-detail-search"
                type="text"
                placeholder="Search destinations..."
                className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </form>

        <div className="grid gap-8 md:grid-cols-[2fr,1.3fr]">
          <div>
            <div className="md:hidden mb-4">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={media[activeImageIndex].url}
                  alt={
                    media[activeImageIndex].alt ||
                    `${venue.name} image ${activeImageIndex + 1}`
                  }
                  className="w-full h-64 object-cover"
                  onClick={() => openModal(activeImageIndex)}
                />
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
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

            <div className="mt-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                {venue.name}
              </h1>

              <p className="text-gray-600 mb-2 flex items-center gap-1">
                <span className="text-lg">📍</span>
                {venue.location?.city || "Unknown location"},{" "}
                {venue.location?.country || ""}
              </p>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <p className="text-lg font-semibold">
                  ${venue.price} per night
                </p>
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
                  className="text-coral font-semibold underline underline-offset-2"
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
              <p>• No smoking</p>
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