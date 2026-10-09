import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [logemail, setLogemail] = useState("");
  const [logpassword, setLogpassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [logflag, setLogflag] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  function loghandlesubmit(e) {
    e.preventDefault();

    const loggedemail = JSON.parse(localStorage.getItem("Email"));
    const loggedpass = JSON.parse(localStorage.getItem("Password"));

    if (!logemail || !logpassword || !adminCode) {
      setLogflag(true);
    } else {
      setLogflag(false);

      if (
        loggedemail === logemail &&
        loggedpass === logpassword &&
        adminCode === "608255"
      ) {
        localStorage.setItem("loggedin", true);
        localStorage.setItem("isAdmin", true);
        navigate("/Dashboard");
      } else {
        alert("Wrong email, password, or admin code");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>

            <p className="text-gray-500 mt-2 text-sm">
              Login to your account to continue
            </p>
          </div>

          <form onSubmit={loghandlesubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={logemail}
                onChange={(e) => setLogemail(e.target.value)}
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
                  placeholder="Enter your password"
                  value={logpassword}
                  onChange={(e) => setLogpassword(e.target.value)}
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
                Admin Code
              </label>

              <div className="relative">
                <input
                  type={showAdminCode ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="Enter your admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 pr-12 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
                  aria-label={
                    showAdminCode ? "Hide admin code" : "Show admin code"
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

            {logflag && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                role="alert"
              >
                Please fill in all fields.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-[0.98] transition duration-200 shadow-md shadow-blue-200"
            >
              Login
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/Register"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
            >
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
