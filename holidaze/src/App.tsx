import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import VenuesList from "./pages/VenuesList";
import VenueDetail from "./pages/VenueDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ManagerDashboard from "./pages/ManagerDashboard";
import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans text-teal">
      <Navbar />
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 py-8 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<VenuesList />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/create" element={<CreateVenue />} />
          <Route path="/edit/:id" element={<EditVenue />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;