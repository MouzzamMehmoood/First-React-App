import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "../Components/ThemeSelector";

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [orders, setOrders] = useState(readOrders);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem("loggedin");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  }

  function refreshOrders() {
    setOrders(readOrders());
  }

  function markAsShipped(orderId) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Shipped" } : order,
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  }

  function deleteShippedOrder(orderId) {
    const order = orders.find((item) => item.id === orderId);
    if (order?.status !== "Shipped") {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete shipped order #${orderId} from the dashboard?`,
    );
    if (!shouldDelete) {
      return;
    }

    const updatedOrders = orders.filter((item) => item.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  }

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
            className={`block rounded-lg px-4 py-3 transition ${darkMode ? "text-base-content/80 hover:bg-base-200 hover:text-primary" : "text-base-content/70 hover:bg-base-200 hover:text-primary"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/product"
            className={`block rounded-lg px-4 py-3 transition ${darkMode ? "text-base-content/80 hover:bg-base-200 hover:text-primary" : "text-base-content/70 hover:bg-base-200 hover:text-primary"}`}
          >
            Products
          </Link>
          <Link
            to="/orders"
            className="block rounded-lg bg-primary px-4 py-3 text-primary-content"
          >
            Orders
          </Link>
          <Link
            to="/customers"
            className={`block rounded-lg px-4 py-3 transition ${darkMode ? "text-base-content/80 hover:bg-base-200 hover:text-primary" : "text-base-content/70 hover:bg-base-200 hover:text-primary"}`}
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
                Sales overview
              </p>
              <h2 className="mt-1 text-3xl font-bold">Orders</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Review every order received from SHIEN 2.0.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeSelector theme={theme} onThemeChange={setTheme} />
            <button
              type="button"
              onClick={refreshOrders}
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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/60">Orders received</p>
            <p className="mt-2 text-3xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/60">Items sold</p>
            <p className="mt-2 text-3xl font-bold">
              {orders.reduce(
                (total, order) =>
                  total +
                  (order.items || []).reduce(
                    (count, item) => count + Number(item.quantity || 0),
                    0,
                  ),
                0,
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-sm text-base-content/60">Revenue</p>
            <p className="mt-2 text-3xl font-bold">
              $
              {orders
                .reduce((total, order) => total + Number(order.total || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-20 text-center">
            <p className="text-lg font-semibold">No orders received yet</p>
            <p className="mt-2 text-sm text-base-content/60">
              Orders placed through the storefront will appear here.
            </p>
          </section>
        ) : (
          <section className="space-y-5">
            {[...orders].reverse().map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 border-b border-base-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold">Order #{order.id}</h3>
                      <span
                        className={`badge badge-outline ${order.status === "Shipped" ? "badge-info" : "badge-success"}`}
                      >
                        {order.status || "Received"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-base-content/60">
                      Customer order details and payment information
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <p className="text-xl font-bold text-primary">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                    {order.status === "Shipped" ? (
                      <button
                        type="button"
                        onClick={() => deleteShippedOrder(order.id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsShipped(order.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Mark as shipped
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                      Customer
                    </p>
                    <p className="mt-2 font-semibold">
                      {order.customer?.name || "Unknown customer"}
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      {order.customer?.email || "No email"}
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      {order.customer?.phone || "No phone"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                      Delivery address
                    </p>
                    <p className="mt-2 text-sm leading-6 text-base-content/70">
                      {order.customer?.address || "No address"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                      Payment
                    </p>
                    <p className="mt-2 font-semibold">
                      {order.customer?.paymentMethod || "Not provided"}
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                      Coupon: {order.customer?.coupon || "None"}
                    </p>
                    <p className="mt-1 text-sm text-success">
                      Discount: -${Number(order.discount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-300">
                  <table className="w-full min-w-130 text-left text-sm">
                    <thead className="bg-base-200 text-xs uppercase tracking-wide text-base-content/60">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Line total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300">
                      {(order.items || []).map((item) => (
                        <tr key={`${order.id}-${item.id}`}>
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">
                            $
                            {Number(
                              item.discountedUnitPrice ??
                                Number(item.price || 0) *
                                  (1 -
                                    Number(order.discount || 0) /
                                      Math.max(Number(order.subtotal || 0), 1)),
                            ).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            $
                            {(
                              item.lineTotal ??
                              Number(item.price || 0) *
                                Number(item.quantity || 0) *
                                (1 -
                                  Number(order.discount || 0) /
                                    Math.max(Number(order.subtotal || 0), 1))
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Orders;
