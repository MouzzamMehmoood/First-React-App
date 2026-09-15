import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [logemail, setLogemail] = useState("");
  const [logpassword, setLogpassword] = useState("");
  const [logflag, setLogflag] = useState(false);

  function loghandlesubmit(e) {
    e.preventDefault();

    const loggedemail = JSON.parse(localStorage.getItem("Email"));
    const loggedpass = JSON.parse(localStorage.getItem("Password"));

    if (!logemail || !logpassword) {
      setLogflag(true);
    } else {
      setLogflag(false);

      if (loggedemail === logemail && loggedpass === logpassword) {
        localStorage.setItem("loggedin", true);
        navigate("/");
      } else {
        alert("Wrong information");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={logpassword}
                onChange={(e) => setLogpassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
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
              to="/register"
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
