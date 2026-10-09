import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
const readProducts = () => {
  try {
    return JSON.parse(localStorage.getItem("products")) || [];
  } catch {
    return [];
  }
};

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const Shop = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("shopTheme") || "light",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(readProducts);
  const [cart, setCart] = useState(readCart);
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState("create");
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderName, setLastOrderName] = useState("");
  const [customer, setCustomer] = useState({
    name: (() => {
      try {
        return JSON.parse(localStorage.getItem("currentCustomer"))?.name || "";
      } catch {
        return "";
      }
    })(),
    phone: "",
    email: (() => {
      try {
        return JSON.parse(localStorage.getItem("currentCustomer"))?.email || "";
      } catch {
        return "";
      }
    })(),
    address: "",
    paymentMethod: "Cash on delivery",
    coupon: "",
  });

  const isCustomerSignedIn = Boolean(localStorage.getItem("currentCustomer"));

  function requireCustomerAccount() {
    if (!isCustomerSignedIn) {
      setAccountOpen(true);
      return false;
    }

    return true;
  }

  function handleAccountChange(event) {
    setAccountForm({
      ...accountForm,
      [event.target.name]: event.target.value,
    });
  }

  function createCustomerAccount(event) {
    event.preventDefault();
    const name = accountForm.name.trim();
    const email = accountForm.email.trim().toLowerCase();

    if (
      !name ||
      !email ||
      !accountForm.password ||
      !accountForm.confirmPassword
    ) {
      setAccountError("Please complete every field...");
      return;
    }

    if (accountForm.password !== accountForm.confirmPassword) {
      setAccountError("Passwords do not match...");
      return;
    }

    const customerAccount = {
      id: email,
      name,
      email,
      password: accountForm.password,
      createdAt: new Date().toISOString(),
    };
    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];

    localStorage.setItem(
      "customers",
      JSON.stringify([
        ...savedCustomers.filter((customer) => customer.id !== email),
        customerAccount,
      ]),
    );
    localStorage.setItem("currentCustomer", JSON.stringify(customerAccount));
    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      name,
      email,
    }));
    setAccountForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAccountError("");
    setAccountOpen(false);
    setAccountCreated(true);
  }

  function loginCustomer(event) {
    event.preventDefault();
    const email = accountForm.email.trim().toLowerCase();
    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const customerAccount = savedCustomers.find(
      (customer) =>
        customer.email === email && customer.password === accountForm.password,
    );

    if (!customerAccount) {
      setAccountError("Invalid email or password.");
      return;
    }

    localStorage.setItem("currentCustomer", JSON.stringify(customerAccount));
    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      name: customerAccount.name,
      email: customerAccount.email,
    }));
    setAccountForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAccountError("");
    setAccountOpen(false);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const refreshProducts = () => setProducts(readProducts());
    window.addEventListener("storage", refreshProducts);
    return () => window.removeEventListener("storage", refreshProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem("shopTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesWishlist = !wishlistOnly || wishlist.includes(product.id);
      return matchesSearch && matchesCategory && matchesWishlist;
    });
  }, [category, products, search, wishlist, wishlistOnly]);

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [products, wishlist],
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0,
  );
  const couponApplied = customer.coupon.trim().toUpperCase() === "SHIEN20";
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const orderTotal = cartTotal - discount;

  function toggleWishlist(productId) {
    if (!requireCustomerAccount()) {
      return;
    }

    setWishlist((currentWishlist) =>
      currentWishlist.includes(productId)
        ? currentWishlist.filter((id) => id !== productId)
        : [...currentWishlist, productId],
    );
  }

  function addToCart(product) {
    if (!requireCustomerAccount()) {
      return;
    }

    if (Number(product.stock || 0) < 1) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, Number(product.stock)),
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: Number(product.stock),
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  }

  function changeQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(item.quantity + change, 0),
                  item.stock,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }

  function handleCustomerChange(event) {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!requireCustomerAccount()) {
      return;
    }

    if (
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !cart.length
    ) {
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const customerId = customer.email || customer.phone || customer.name;
    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const deletedCustomerIds =
      JSON.parse(localStorage.getItem("deletedCustomerIds")) || [];
    const updatedCustomers = [
      ...savedCustomers.filter((item) => item.id !== customerId),
      { id: customerId, ...customer },
    ];
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    localStorage.setItem(
      "deletedCustomerIds",
      JSON.stringify(deletedCustomerIds.filter((id) => id !== customerId)),
    );
    const orderItems = cart.map((item) => {
      const lineSubtotal = Number(item.price || 0) * Number(item.quantity || 0);
      const lineDiscount = cartTotal
        ? (lineSubtotal / cartTotal) * discount
        : 0;

      return {
        ...item,
        lineTotal: lineSubtotal - lineDiscount,
        discountedUnitPrice:
          Number(item.quantity || 0) > 0
            ? (lineSubtotal - lineDiscount) / Number(item.quantity)
            : Number(item.price || 0),
      };
    });
    localStorage.setItem(
      "orders",
      JSON.stringify([
        ...orders,
        {
          id: orders.length + 1,
          customer,
          items: orderItems,
          subtotal: cartTotal,
          discount,
          total: orderTotal,
          status: "Received",
        },
      ]),
    );
    setLastOrderName(customer.name);
    setCart([]);
    setCheckoutOpen(false);
    setOrderPlaced(true);
    setCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      paymentMethod: "Cash on delivery",
      coupon: "",
    });
  }

  return (
    <div
      className={`shop-page shop-shell min-h-screen text-slate-900 ${
        theme === "dark" ? "shop-dark" : ""
      }`}
    >
      {isLoading && (
        <div className="loading-screen fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm">
          <div className="loading-panel relative flex flex-col items-center gap-4 overflow-hidden rounded-[2.25rem] border border-[#d9c5a7] bg-[#f9f4ee]/90 px-10 py-8 text-center shadow-[0_22px_70px_rgba(71,52,35,0.16)]">
            <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#d0ae84] to-transparent" />
            <div className="loading-orb relative flex h-20 w-20 items-center justify-center rounded-full border border-[#dbc4a0] bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(236,222,210,0.72)_44%,rgba(122,89,68,0.18)_100%)]">
              <div className="loading-spinner absolute inset-2 rounded-full border-4 border-[#e9dcc7] border-t-[#7a5841] border-r-[#9a7c5d]"></div>
              <span className="relative text-lg font-semibold tracking-[0.22em] text-[#6e4d3b]">
                S
              </span>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#79553a]">
                SHIEN
              </p>
              <p className="mt-2 text-sm font-medium tracking-[0.08em] text-[#4b3a2d] uppercase">
                Loading collection
              </p>
            </div>
            <div className="loading-dots flex items-center gap-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <header className="shop-header border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="shop-header-inner mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/shop"
            className="shop-logo flex shrink-0 items-center gap-3"
          >
            <span className="shop-logo-mark" aria-label="SHIEN monogram">
              <span className="shop-logo-monogram">S</span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="shop-logo-word font-serif text-2xl font-semibold tracking-[0.18em] text-slate-950 sm:text-3xl">
                SHIEN
              </span>
              <span className="shop-logo-version text-[10px] font-semibold tracking-[0.16em] text-blue-600">
                2.0
              </span>
            </span>
          </Link>

          <div className="hidden max-w-md flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the collection"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="shop-theme-toggle rounded-full border px-3 py-2 text-sm font-semibold transition sm:px-4"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
              <span className="ml-1 hidden sm:inline">
                {theme === "light" ? "Night" : "Day"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className={`rounded-full border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                wishlistOpen
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "shop-control border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
              }`}
              aria-label={`Open wishlist with ${wishlistProducts.length} saved products`}
            >
              <span aria-hidden="true">♡</span>
              <span className="ml-1 hidden sm:inline">Wishlist</span>
              <span className="ml-1">{wishlistProducts.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Cart
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
        <div className="mx-auto block max-w-7xl px-4 pb-4 md:hidden sm:px-6">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="shop-hero flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:flex-row sm:items-end sm:px-8 sm:py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Thoughtfully selected
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Everyday pieces, chosen well.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
              Explore the latest collection from our independent makers and
              bring something considered home.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3">
            <button
              type="button"
              onClick={() => {
                setAccountMode("login");
                setAccountError("");
                setAccountOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-full border border-[#9a7658] bg-[#f7efe5] px-5 py-3 font-serif text-sm font-semibold tracking-wide text-[#5c4030] shadow-sm transition hover:border-[#76543d] hover:bg-[#eee0d0]"
            >
              Customer login
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountMode("create");
                setAccountOpen(true);
              }}
              className="shop-cta inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
            >
              Create an account{" "}
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </section>

        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((categoryName) => (
              <button
                key={categoryName}
                type="button"
                onClick={() => setCategory(categoryName)}
                className={`shop-control rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === categoryName
                    ? "bg-slate-900 text-white"
                    : "shop-control bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-600 hover:text-blue-600"
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <section className="shop-empty rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Nothing here yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {products.length
                ? "Try another search or category."
                : "New pieces will appear here when the catalog is updated."}
            </p>
          </section>
        ) : (
          <section className="shop-product-grid grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, productIndex) => {
              const isWishlisted = wishlist.includes(product.id);
              const stock = Number(product.stock || 0);

              return (
                <article
                  key={product.id}
                  className="shop-product group"
                  style={{ "--product-index": productIndex }}
                >
                  <div className="shop-product-media relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Image coming soon
                      </div>
                    )}
                    <div className="shop-product-badge absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                      {product.category || "Collection"}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`shop-product-wishlist absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur transition ${
                        isWishlisted
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900/90 text-slate-700 hover:text-blue-600"
                      }`}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={isWishlisted}
                    >
                      <span className="text-xl leading-none" aria-hidden="true">
                        {isWishlisted ? "♥" : "♡"}
                      </span>
                    </button>
                    {stock < 1 && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white">
                        Sold out
                      </span>
                    )}
                  </div>
                  <div className="shop-product-info pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="shop-product-edition text-xs font-semibold uppercase tracking-[0.16em]">
                          Edition {String(productIndex + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">
                          {product.name}
                        </h3>
                      </div>
                      <p className="shrink-0 text-base font-semibold text-slate-900">
                        ${Number(product.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                      {product.description ||
                        "A considered addition to your everyday collection."}
                    </p>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={stock < 1}
                      className="shop-product-action shop-control mt-4 w-full rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                    >
                      {stock < 1 ? "Out of stock" : "Add to cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <footer className="shop-footer border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold tracking-wide text-slate-900">
              SHIEN 2.0
            </p>
            <p className="mt-1">A considered collection for everyday living.</p>
          </div>
          <p>© 2026 SHIEN 2.0. All rights reserved.</p>
          <button
            type="button"
            onClick={() => {
              setAccountMode("create");
              setAccountOpen(true);
            }}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </button>
        </div>
      </footer>

      {wishlistOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40"
          onClick={() => setWishlistOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Saved for later
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Wishlist
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
                aria-label="Close wishlist"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {wishlistProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-2xl text-blue-600">
                    ♡
                  </div>
                  <p className="mt-5 font-semibold text-slate-900">
                    Your wishlist is empty
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Tap the heart on any product to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {wishlistProducts.map((product) => {
                    const stock = Number(product.stock || 0);

                    return (
                      <div key={product.id} className="flex gap-3">
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-xs text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                ${Number(product.price || 0).toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              className="text-xl leading-none text-blue-600 hover:text-red-600"
                              aria-label={`Remove ${product.name} from wishlist`}
                            >
                              ♥
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            disabled={stock < 1}
                            className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                          >
                            {stock < 1 ? "Out of stock" : "Add to cart"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {wishlistProducts.length > 0 && (
              <div className="border-t border-slate-200 px-5 py-5">
                <button
                  type="button"
                  onClick={() => {
                    setWishlistOnly(true);
                    setWishlistOpen(false);
                  }}
                  className="w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
                >
                  View saved products
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Your selection
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Shopping cart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cart.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Your cart is waiting for something good.
                </p>
              ) : (
                <div className="space-y-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="truncate font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="font-semibold text-slate-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              className="px-2.5 py-1 text-slate-600 hover:text-blue-600"
                            >
                              −
                            </button>
                            <span className="min-w-7 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              className="px-2.5 py-1 text-slate-600 hover:text-blue-600"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-semibold text-slate-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 px-5 py-5">
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Shipping and taxes are calculated at checkout.
              </p>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  if (requireCustomerAccount()) {
                    setCheckoutOpen(true);
                  }
                }}
                className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Continue to checkout
              </button>
            </div>
          </aside>
        </div>
      )}

      {accountOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 px-4">
          <form
            onSubmit={
              accountMode === "create" ? createCustomerAccount : loginCustomer
            }
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Shopper account
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {accountMode === "create"
                    ? "Create your account"
                    : "Customer login"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {accountMode === "create"
                    ? "Create an account to save items, use your cart, and place orders."
                    : "Sign in to use your saved items, cart, and customer details."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  setAccountError("");
                }}
                className="text-2xl leading-none text-slate-400 hover:text-slate-800"
                aria-label="Close account form"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {accountMode === "create" && (
                <input
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                  placeholder="Full name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              )}
              <input
                type="email"
                name="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                placeholder="Email address"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <input
                type="password"
                name="password"
                value={accountForm.password}
                onChange={handleAccountChange}
                placeholder="Create a password"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              {accountMode === "create" && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={accountForm.confirmPassword}
                  onChange={handleAccountChange}
                  placeholder="Confirm password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              )}
            </div>
            {accountError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {accountError}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {accountMode === "create" ? "Create account" : "Login"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountMode(accountMode === "create" ? "login" : "create");
                setAccountError("");
              }}
              className="mt-3 w-full text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {accountMode === "create"
                ? "Already have an account? Login"
                : "Need an account? Create one"}
            </button>
          </form>
        </div>
      )}

      {accountCreated && (
        <div
          className="modal-backdrop fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-account-created-title"
        >
          <div className="modal-pop w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="success-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-600">
              ✓
            </div>
            <h2
              id="customer-account-created-title"
              className="success-copy mt-5 text-2xl font-semibold text-slate-950"
            >
              Thank you for creating your account
            </h2>
            <p className="success-copy mt-2 text-sm leading-6 text-slate-500">
              Your account is ready. You can now save products, use your cart,
              and place orders.
            </p>
            <button
              type="button"
              onClick={() => setAccountCreated(false)}
              className="success-action mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 px-4">
          <form
            onSubmit={placeOrder}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Almost yours
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Checkout
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="text-2xl leading-none text-slate-400 hover:text-slate-800"
                aria-label="Close checkout"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Full name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Phone number"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email address"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:col-span-2"
              />
              <textarea
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                placeholder="Delivery address"
                rows="2"
                required
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:col-span-2"
              />
              <select
                name="paymentMethod"
                value={customer.paymentMethod}
                onChange={handleCustomerChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:col-span-2"
              >
                <option>Cash on delivery</option>
                <option>Credit or debit card</option>
                <option>Bank transfer</option>
                <option>Mobile wallet</option>
              </select>
              <div className="flex gap-2 sm:col-span-2">
                <input
                  name="coupon"
                  value={customer.coupon}
                  onChange={handleCustomerChange}
                  placeholder="Coupon code"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <span
                  className={`grid shrink-0 place-items-center rounded-xl px-3 text-xs font-semibold ${
                    couponApplied
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {couponApplied ? "20% off" : "Try SHIEN20"}
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Order items
              </p>
              <div className="space-y-2">
                {cart.map((item) => {
                  const lineSubtotal =
                    Number(item.price || 0) * Number(item.quantity || 0);
                  const lineDiscount = cartTotal
                    ? (lineSubtotal / cartTotal) * discount
                    : 0;
                  const lineTotal = lineSubtotal - lineDiscount;
                  const discountedUnitPrice =
                    Number(item.quantity || 0) > 0
                      ? lineTotal / Number(item.quantity)
                      : Number(item.price || 0);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-xs text-slate-500">
                          ${discountedUnitPrice.toFixed(2)} each
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold text-slate-900">
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>SHIEN20 discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Place order
            </button>
          </form>
        </div>
      )}

      {orderPlaced && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-2xl text-blue-600">
              ✓
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">
              Order Placed Successfully
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Thank you, {lastOrderName || "there"}. Your order is being
              prepared.
            </p>
            <button
              type="button"
              onClick={() => setOrderPlaced(false)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
