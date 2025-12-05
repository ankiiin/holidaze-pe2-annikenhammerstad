import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "https://v2.api.noroff.dev";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState<"customer" | "manager">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));
      
      const actualRole = data.data.venueManager ? "manager" : "customer";
      localStorage.setItem("role", actualRole);

      window.dispatchEvent(new Event("storage"));

      toast.success("Logged in successfully!");

      navigate("/profile");

      setLoading(false);

      if (actualRole === "manager") {
        navigate("/manager");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-4xl font-serif font-bold text-center mb-8">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 
                         focus:ring-2 focus:ring-coral/40"
              placeholder="example@stud.noroff.no"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 
                         focus:ring-2 focus:ring-coral/40"
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[45px] -translate-y-1/2 
                         text-gray-600 hover:text-gray-800"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.477 10.477A3 3 0 0114.5 14.5M9.88 9.88a3 3 0 104.24 4.24M6.228 6.228C3.67 8.057 2.25 10.5 2.25 10.5s3.75 6.75 9.75 6.75c1.38 0 2.67-.23 3.84-.65M17.772 17.772C20.33 15.943 21.75 13.5 21.75 13.5s-3.75-6.75-9.75-6.75c-1.38 0-2.67.23-3.84.65"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-center items-center gap-8 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
              />
              I'm a customer
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                checked={role === "manager"}
                onChange={() => setRole("manager")}
              />
              I'm a venue manager
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white py-3 rounded-md font-semibold 
                       hover:bg-coral/90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOG IN"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <button
            className="font-semibold text-coral underline"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
