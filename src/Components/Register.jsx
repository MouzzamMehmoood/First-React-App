import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [flag, setFlag] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  function handlesubmit(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setFlag(true);
    } else if (password !== confirmPassword) {
      setFlag(true);
    } else {
      setFlag(false);

      localStorage.setItem("Name", JSON.stringify(name));
      localStorage.setItem("Email", JSON.stringify(email));
      localStorage.setItem("Password", JSON.stringify(password));

      setRegistrationSuccess(true);
    }
  }

  function handleSuccessClose() {
    navigate("/shop");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

            <p className="text-gray-500 mt-2 text-sm">
              Register your account to get started
            </p>
          </div>

          <form onSubmit={handlesubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 pr-12 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 pr-12 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </button>
              </div>
            </div>

            {flag && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                role="alert"
              >
                {!password || !confirmPassword
                  ? "Please fill in all fields."
                  : "Passwords do not match."}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-[0.98] transition duration-200 shadow-md shadow-blue-200"
            >
              Register
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
            >
              Log In
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Dashboard. All rights reserved.
        </p>
      </div>

      {registrationSuccess && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-success-title"
        >
          <div className="modal-pop w-full max-w-sm rounded-2xl border border-gray-200 bg-[#f8fafc] p-7 text-center text-gray-800 shadow-2xl">
            <div className="success-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
              ✓
            </div>
            <h2
              id="registration-success-title"
              className="success-copy text-2xl font-bold"
            >
              Registration Successful
            </h2>
            <p className="success-copy mt-2 text-gray-500">
              Your account has been created successfully.
            </p>
            <button
              type="button"
              onClick={handleSuccessClose}
              className="success-action mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
