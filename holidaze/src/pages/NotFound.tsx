import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-serif font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 text-lg mb-8">
        Oops... the page you´re looking for doesn´t exist.
      </p>

      <Link
        to="/"
        className="bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e15e52] transition"
      >
        Go back home
      </Link>
    </section>
  );
}
