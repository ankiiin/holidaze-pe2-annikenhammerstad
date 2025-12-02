import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-azure text-white py-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-orange-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-xl font-bold text-coral tracking-wide">
                HOLIDAZE
              </span>
              <span className="text-sm text-beige italic">
                Modern escape — where design meets wanderlust.
              </span>
            </div>
          </Link>
        </div>
        <div className="flex space-x-4 text-2xl">
          <Link
            to="#"
            aria-label="Facebook"
            className="text-white hover:text-coral transition"
          >
            <FaFacebookF />
          </Link>
          <Link
            to="#"
            aria-label="Instagram"
            className="text-white hover:text-coral transition"
          >
            <FaInstagram />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
