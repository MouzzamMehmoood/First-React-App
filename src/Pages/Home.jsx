import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "../Components/ThemeSelector";

const Home = () => {
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem("Name"));

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const darkMode = [
    "dark",
    "synthwave",
    "halloween",
    "forest",
    "black",
    "luxury",
    "dracula",
    "business",
    "night",
    "coffee",
    "dim",
    "abyss",
  ].includes(theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [products] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const totalStock = products.reduce(
    (total, item) => total + Number(item.stock || 0),
    0,
  );
  const inventoryValue = products.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.stock || 0),
    0,
  );
  const categoryCount = new Set(
    products.map((item) => item.category).filter(Boolean),
  ).size;

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function handleLogout(e) {
    e.preventDefault();
    navigate("/Login");
    localStorage.removeItem("loggedin");
  }

  return (
    <div className="min-h-screen flex bg-base-200 text-base-content transition-colors duration-300">
      <aside
        className={`${mobileMenuOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 w-72 border-r border-base-300 bg-base-100 flex-col p-6 transition-transform duration-300 md:static md:flex md:w-64`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-primary">DASHBOARD</h1>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            X
          </button>
        </div>

        <nav className="space-y-3">
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg border border-primary/30 px-4 py-3 text-primary transition hover:bg-primary/10"
          >
            View storefront
          </Link>
          <a
            href="#"
            className="block rounded-lg bg-primary px-4 py-3 text-primary-content"
          >
            Dashboard
          </a>

          <Link
            to="/product"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-primary"
            }`}
          >
            Products
          </Link>

          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-primary"
            }`}
          >
            Orders
          </Link>

          <Link
            to="/customers"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-primary"
            }`}
          >
            Customers
          </Link>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-primary"
            }`}
          >
            Settings
          </a>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 bg-base-200 p-3 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="btn btn-ghost btn-square shrink-0 text-2xl md:hidden"
                aria-label="Open navigation menu"
              >
                ☰
              </button>
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Dashboard
              </h2>
            </div>

            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Welcome back! <span className="text-primary">{name}</span>
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
            <ThemeSelector theme={theme} onThemeChange={setTheme} />

            <button
              onClick={handleLogout}
              className="btn btn-primary flex-1 px-3 text-sm sm:flex-none sm:px-5 sm:text-base"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[
            ["Products", products.length, "Total catalog items"],
            ["Stock units", totalStock, "Units currently listed"],
            [
              "Inventory value",
              `$${inventoryValue.toFixed(2)}`,
              "Price x stock",
            ],
            ["Categories", categoryCount, "Active product groups"],
          ].map(([label, value, detail]) => (
            <div
              key={label}
              className={`rounded-xl border p-5 shadow-sm ${"bg-base-100 border-base-300"}`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {label}
              </p>
              <p
                className={`text-2xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {value}
              </p>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section
            className={`lg:col-span-2 rounded-2xl border p-4 sm:p-6 shadow-sm ${"bg-base-100 border-base-300"}`}
          >
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="min-w-0">
                <h3 className="text-xl font-bold">Inventory overview</h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  A quick view of your product operation.
                </p>
              </div>
              <span className="shrink-0 text-2xl">▦</span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Catalog coverage</span>
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {products.length} items
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-base-300">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(products.length * 10, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Stock availability</span>
                  <span
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {totalStock} units
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-base-300">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(totalStock, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            className={`rounded-2xl border p-4 sm:p-6 shadow-sm ${"bg-base-100 border-base-300"}`}
          >
            <h3 className="text-xl font-bold">Quick actions</h3>
            <p
              className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Keep your catalog up to date.
            </p>
            <Link to="/product" className="btn btn-primary mt-6 block w-full">
              <h1 className="mt-2"> Open Product Manager</h1>
            </Link>
            <div className="mt-4 rounded-lg bg-base-200 p-4 text-sm text-base-content">
              Add images by pasting a direct image link in the Product Manager.
            </div>
          </section>
        </div>

        <section
          className={`mt-6 rounded-2xl border p-4 sm:p-5 shadow-sm ${"bg-base-100 border-base-300"}`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold">Recent products</h3>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                A quick look at your catalog.
              </p>
            </div>
            <Link
              to="/product"
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>

          {products.length === 0 ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              No products have been added yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-11 w-11 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`truncate text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {item.category || "Uncategorized"}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}
                  >
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
