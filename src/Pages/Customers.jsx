import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "../Components/ThemeSelector";

const readCustomers = () => {
  try {
    return JSON.parse(localStorage.getItem("customers")) || [];
  } catch {
    return [];
  }
};

const readDeletedCustomerIds = () => {
  try {
    return JSON.parse(localStorage.getItem("deletedCustomerIds")) || [];
  } catch {
    return [];
  }
};

const Customers = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [savedCustomers, setSavedCustomers] = useState(readCustomers);
  const [deletedCustomerIds, setDeletedCustomerIds] = useState(
    readDeletedCustomerIds,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const customers = useMemo(
    () =>
      savedCustomers
        .filter((customer) => !deletedCustomerIds.includes(customer.id))
        .map((customer) => ({
          id: customer.id,
          name: customer.name || "Unknown customer",
          email: customer.email || "No email",
          createdAt: customer.createdAt,
        })),
    [deletedCustomerIds, savedCustomers],
  );

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  });

  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem("loggedin");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  }

  function refreshCustomers() {
    setSavedCustomers(readCustomers());
    setDeletedCustomerIds(readDeletedCustomerIds());
  }

  function deleteCustomer(customer) {
    const shouldDelete = window.confirm(
      `Remove ${customer.name} from the customer directory?`,
    );
    if (!shouldDelete) {
      return;
    }

    const updatedCustomers = savedCustomers.filter(
      (item) => item.id !== customer.id,
    );
    const updatedDeletedIds = [...deletedCustomerIds, customer.id];

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    localStorage.setItem(
      "deletedCustomerIds",
      JSON.stringify(updatedDeletedIds),
    );
    setSavedCustomers(updatedCustomers);
    setDeletedCustomerIds(updatedDeletedIds);
  }

  const menuLinkClass = darkMode
    ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
    : "text-base-content/70 hover:bg-base-200 hover:text-primary";

  return (
    <div className="min-h-screen flex bg-base-200 text-base-content transition-colors duration-300">
      <aside
        className={`${mobileMenuOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 w-72 border-r border-base-300 bg-base-100 flex-col p-6 md:static md:flex md:w-64`}
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
            className="block rounded-lg border border-primary/30 px-4 py-3 text-primary hover:bg-primary/10"
          >
            View storefront
          </Link>
          <Link
            to="/Dashboard"
            className={`block rounded-lg px-4 py-3 transition ${menuLinkClass}`}
          >
            Dashboard
          </Link>
          <Link
            to="/product"
            className={`block rounded-lg px-4 py-3 transition ${menuLinkClass}`}
          >
            Products
          </Link>
          <Link
            to="/orders"
            className={`block rounded-lg px-4 py-3 transition ${menuLinkClass}`}
          >
            Orders
          </Link>
          <Link
            to="/customers"
            className="block rounded-lg bg-primary px-4 py-3 text-primary-content"
          >
            Customers
          </Link>
        </nav>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <main className="min-w-0 flex-1 bg-base-200 p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-ghost btn-square text-2xl md:hidden"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Customer directory
              </p>
              <h2 className="mt-1 text-3xl font-bold">Customers</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Registered account details.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeSelector theme={theme} onThemeChange={setTheme} />
            <button
              type="button"
              onClick={refreshCustomers}
              className="btn btn-outline"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-primary"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-2xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm">
            <p className="text-sm text-base-content/60">Total customers</p>
            <p className="mt-1 text-3xl font-bold">{customers.length}</p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:max-w-sm"
          />
        </div>

        {filteredCustomers.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-20 text-center">
            <p className="text-lg font-semibold">No customers found</p>
            <p className="mt-2 text-sm text-base-content/60">
              Registered customers will appear here.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredCustomers.map((customer) => (
              <article
                key={customer.id}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/15 text-lg font-bold text-primary">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Registered customer
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => deleteCustomer(customer)}
                      className="btn btn-error btn-xs"
                    >
                      Delete customer
                    </button>
                  </div>
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">
                      Email
                    </dt>
                    <dd className="mt-1 wrap-break-word">{customer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">
                      Created
                    </dt>
                    <dd className="mt-1">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "Not available"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Customers;
