import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedVenues, getVenueReviews } from "../api/listings";
import PromoBanner from "../components/PromoBanner";

export default function Home() {
  const [venues, setVenues] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedVenues = await getFeaturedVenues(3);
      setVenues(fetchedVenues);

      if (fetchedVenues.length > 0) {
        const venueId = fetchedVenues[0].id;
        const fetchedReviews = await getVenueReviews(venueId);
        setReviews(fetchedReviews);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <section
        className="relative h-[80vh] flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/beach-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Find your next escape
          </h1>
          <p className="text-lg mb-8 font-light">
            Unique stays, cozy cabins and city getaways across the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="text"
              placeholder="Search destinations..."
              className="px-4 py-3 w-64 sm:w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coral text-gray-700"
            />
            <Link
              to="/explore"
              className="bg-coral text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#e15e52] transition"
            >
              Explore stays
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-200 opacity-90">
            Discover over 700+ handpicked destinations
          </p>
        </div>
      </section>
      <section className="py-16 px-6 md:px-12 bg-white text-center">
        <h2 className="text-3xl font-serif font-bold mb-2">Featured stays</h2>
        <p className="text-gray-600 mb-12">
          Hand-picked getaways loved by our guests.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img
                src={venue.media?.[0]?.url || "/images/placeholder.jpg"}
                alt={venue.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-5 text-left">
                <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {venue.location?.country}
                </p>
                <p className="text-coral font-medium mb-3">
                  ${venue.price} per night
                </p>
                <Link
                  to={`/venues/${venue.id}`}
                  className="bg-azure text-white px-4 py-2 rounded-lg hover:bg-teal transition text-sm"
                >
                  Book now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PromoBanner />
      {reviews.length > 0 && (
        <section className="py-16 px-6 md:px-12 bg-gray-50 text-center">
          <h2 className="text-3xl font-serif font-bold mb-8">
            What our guests say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <p className="italic text-gray-600 mb-4">
                  "{review.description}"
                </p>
                <p className="font-semibold text-coral">{review.user?.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
