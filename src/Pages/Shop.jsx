import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Atelier Linen Overshirt",
    price: "148.00",
    category: "Apparel",
    stock: 12,
    description: "French organic flax tailored with natural horn buttons and a relaxed, timeless silhouette.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-2",
    name: "Handmade Fluted Ceramic Vase",
    price: "85.00",
    category: "Home & Living",
    stock: 8,
    description: "Wheel-thrown stoneware with an unglazed matte terracotta finish and fluted artisanal texture.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-3",
    name: "Cast Brass Ambient Table Lamp",
    price: "220.00",
    category: "Lighting",
    stock: 5,
    description: "Brushed solid brass weighted base paired with an unbleached linen drum shade for gentle ambient glow.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-4",
    name: "Cypress & Smoky Amber Fragrance",
    price: "95.00",
    category: "Fragrance",
    stock: 16,
    description: "Small-batch botanical eau de parfum with top notes of wild cedar, coastal cypress, and warm amber.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-5",
    name: "Full-Grain Saddle Leather Tote",
    price: "310.00",
    category: "Accessories",
    stock: 4,
    description: "Vegetable-tanned Tuscan leather handcrafted with waxed linen thread and interior brass clip.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-6",
    name: "Brushed Titanium Chrono Timepiece",
    price: "420.00",
    category: "Accessories",
    stock: 6,
    description: "Minimalist sapphire crystal face, Swiss quartz movement, and premium Italian leather strap.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-7",
    name: "Mongolian Cashmere Ribbed Throw",
    price: "185.00",
    category: "Home & Living",
    stock: 9,
    description: "Featherlight 100% Grade-A pure Mongolian cashmere knit in warm oat melange for cozy comfort.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-8",
    name: "Architectural Pour-Over Dripper",
    price: "68.00",
    category: "Home & Living",
    stock: 14,
    description: "Double-walled borosilicate glass with a precision carved walnut collar and reusable filter.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
];

const readProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("products"));
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
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
  const [accountMode, setAccountMode] = useState("login");
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
      setAccountError("Please complete every field.");
      return;
    }

    if (accountForm.password !== accountForm.confirmPassword) {
      setAccountError("Passwords do not match.");
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
        ...savedCustomers.filter((c) => c.id !== email),
        customerAccount,
      ]),
    );
    localStorage.setItem("currentCustomer", JSON.stringify(customerAccount));
    setCustomer((prev) => ({
      ...prev,
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
      (c) => c.email === email && c.password === accountForm.password,
    );

    if (!customerAccount) {
      setAccountError("Invalid email or password.");
      return;
    }

    localStorage.setItem("currentCustomer", JSON.stringify(customerAccount));
    setCustomer((prev) => ({
      ...prev,
      name: customerAccount.name,
      email: customerAccount.email,
    }));
    setAccountForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAccountError("");
    setAccountOpen(false);
  }

  function logoutCustomer() {
    localStorage.removeItem("currentCustomer");
    setCustomer((prev) => ({
      ...prev,
      name: "",
      email: "",
    }));
  }

  useEffect(() => {
    const refreshProducts = () => setProducts(readProducts());
    window.addEventListener("storage", refreshProducts);
    return () => window.removeEventListener("storage", refreshProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem("shopTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
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

    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }

  function addToCart(product) {
    if (!requireCustomerAccount()) {
      return;
    }

    if (Number(product.stock || 0) < 1) {
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, Number(product.stock)),
              }
            : item,
        );
      }

      return [
        ...prevCart,
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
    setCart((prev) =>
      prev
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
    setCart((prev) => prev.filter((item) => item.id !== productId));
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
          date: new Date().toLocaleDateString(),
        },
      ]),
    );

    setLastOrderName(customer.name);
    setCart([]);
    setCheckoutOpen(false);
    setOrderPlaced(true);
    setCustomer((prev) => ({
      ...prev,
      phone: "",
      address: "",
      paymentMethod: "Cash on delivery",
      coupon: "",
    }));
  }

  const isDark = theme === "dark";

  return (
    <div className={`shop-page shop-shell min-h-screen ${isDark ? "shop-dark" : ""}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 px-8 py-6 shadow-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
            <span className="font-heading text-xs font-bold tracking-[0.25em] text-stone-800 dark:text-stone-200 uppercase">
              SHIEN Atelier
            </span>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="border-b border-stone-200/60 dark:border-stone-800/80 bg-stone-900 text-stone-100 text-xs py-2 px-4 text-center font-medium tracking-wide">
        <span>✨ Welcome to the New Season • Enjoy 20% off with code </span>
        <strong className="underline decoration-amber-400 font-semibold text-amber-300">SHIEN20</strong>
        <span> • Complimentary Express Delivery over $100</span>
      </div>

      {/* Navigation Header */}
      <header className="shop-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/shop" className="shop-logo flex shrink-0 items-center gap-3 group">
            <span className="shop-logo-mark">
              <span className="font-editorial text-xl font-bold tracking-wider">S</span>
            </span>
            <div className="flex flex-col">
              <span className="shop-logo-word text-2xl font-bold tracking-[0.22em] text-stone-900 dark:text-white sm:text-2xl">
                SHIEN
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Atelier Edition
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-stone-400">
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collection (e.g. linen, lamp, ceramic)..."
                className="w-full rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50/90 dark:bg-stone-800/80 pl-11 pr-5 py-2.5 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 outline-none transition focus:border-amber-600 focus:bg-white dark:focus:bg-stone-800 focus:ring-3 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center gap-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 transition hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400"
              title={`Switch to ${isDark ? "Day" : "Night"} Mode`}
            >
              <span>{isDark ? "☀️" : "🌙"}</span>
              <span className="hidden sm:inline">{isDark ? "Day" : "Night"}</span>
            </button>

            {/* Customer Account Button */}
            {customer.name ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden lg:inline text-xs font-semibold text-stone-700 dark:text-stone-300 px-2.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  👤 {customer.name}
                </span>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="rounded-full border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs font-medium text-stone-500 hover:text-red-600 dark:hover:text-red-400"
                  title="Sign Out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAccountMode("login");
                  setAccountError("");
                  setAccountOpen(true);
                }}
                className="rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 transition hover:border-amber-600 hover:text-amber-700"
              >
                Sign In
              </button>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                wishlistOpen
                  ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-rose-400 hover:text-rose-600"
              }`}
              aria-label="Wishlist"
            >
              <span className="text-sm text-rose-600">♥</span>
              <span className="hidden sm:inline">Saved</span>
              <span className="rounded-full bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 text-[10px] font-bold">
                {wishlistProducts.length}
              </span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full bg-stone-900 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              <span>🛍 Cart</span>
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mx-auto block max-w-7xl px-4 pb-3 md:hidden">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search luxury collection..."
            className="w-full rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600 focus:bg-white"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Luxury Hero Banner */}
        <section className="shop-hero-card relative p-6 sm:p-10 lg:p-12 mb-10">
          <div className="shop-hero-glow" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block rounded-full bg-amber-100/80 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/60 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300 mb-4">
              ✦ Exclusive Atelier Release
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-black dark:text-white leading-[1.15]">
              Thoughtfully curated for elevated everyday living.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              Discover small-batch apparel, artisanal ceramic home decor, and timeless accessories crafted with uncompromising integrity.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="shop-btn-primary"
              >
                Browse Collection <span>↓</span>
              </a>
              {!customer.name && (
                <button
                  type="button"
                  onClick={() => {
                    setAccountMode("create");
                    setAccountError("");
                    setAccountOpen(true);
                  }}
                  className="shop-btn-secondary"
                >
                  Join Atelier Club →
                </button>
              )}
            </div>
          </div>

          {/* Quick Trust Bar */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <span className="text-base text-amber-600">⚜</span>
              <span>100% Authentic Craft</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <span className="text-base text-amber-600">✈</span>
              <span>Express Insured Shipping</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <span className="text-base text-amber-600">↺</span>
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <span className="text-base text-amber-600">🛡</span>
              <span>Secure Encrypted Payment</span>
            </div>
          </div>
        </section>

        {/* Filter Navigation Bar */}
        <div id="catalog" className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((catName) => (
              <button
                key={catName}
                type="button"
                onClick={() => setCategory(catName)}
                className={`shop-category-chip ${
                  category === catName ? "active" : "inactive"
                }`}
              >
                {catName}
              </button>
            ))}

            {wishlistProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setWishlistOnly(!wishlistOnly)}
                className={`shop-category-chip ${
                  wishlistOnly ? "active" : "inactive"
                } border-rose-300 text-rose-700 dark:text-rose-300`}
              >
                ♥ Saved Only ({wishlistProducts.length})
              </button>
            )}
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"} available
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="my-12 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center bg-stone-50 dark:bg-stone-900/50">
            <span className="text-3xl mb-3 inline-block">🔍</span>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
              No matching pieces found
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Try adjusting your category filter or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSearch("");
                setWishlistOnly(false);
              }}
              className="mt-4 shop-btn-secondary text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const stock = Number(product.stock || 0);

              return (
                <article key={product.id} className="shop-product-card group">
                  {/* Image Container */}
                  <div className="shop-product-media-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="shop-product-img"
                      loading="lazy"
                    />

                    {/* Category Tag */}
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-stone-900/85 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {product.category || "Atelier"}
                    </span>

                    {/* Wishlist Heart Button - High Contrast & Clearly Visible */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`shop-wishlist-btn ${isWishlisted ? "active" : ""}`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      <span className="text-lg leading-none">
                        {isWishlisted ? "♥" : "♡"}
                      </span>
                    </button>

                    {/* Stock Alert Badge */}
                    {stock < 1 ? (
                      <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                        Sold Out
                      </span>
                    ) : stock <= 5 ? (
                      <span className="absolute bottom-3 left-3 rounded-full bg-amber-600/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                        Only {stock} Left
                      </span>
                    ) : (
                      <span className="absolute bottom-3 left-3 rounded-full bg-emerald-700/85 backdrop-blur-md px-3 py-0.5 text-[10px] font-semibold text-white">
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                          {product.name}
                        </h3>
                        <p className="shrink-0 text-base font-extrabold text-stone-900 dark:text-stone-100">
                          ${Number(product.price || 0).toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400 line-clamp-2">
                        {product.description || "A masterfully created addition to your refined collection."}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={stock < 1}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-amber-700 dark:bg-stone-800 dark:hover:bg-amber-600 py-3 text-xs font-bold text-white transition active:scale-98 disabled:cursor-not-allowed disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400"
                    >
                      <span>🛍</span>
                      <span>{stock < 1 ? "Out of Stock" : "Add to Cart"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="shop-footer mt-16 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-stone-800 dark:text-stone-200 text-sm">SHIEN ATELIER</span>
            <span>— Timeless Craftsmanship & Elevated Living.</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span>© 2026 SHIEN Atelier</span>
            <span>•</span>
            <Link to="/Dashboard" className="hover:text-amber-600 transition">Admin Portal</Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 p-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Your Basket</span>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">Shopping Cart ({cartCount})</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-stone-400">
                  <span className="text-4xl">🛍</span>
                  <p className="mt-3 text-sm font-semibold text-stone-600 dark:text-stone-300">Your bag is currently empty.</p>
                  <p className="mt-1 text-xs text-stone-400">Explore the atelier collection to select pieces.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3.5 border-b border-stone-100 dark:border-stone-800 pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-18 rounded-xl object-cover bg-stone-100 dark:bg-stone-800"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white">{item.name}</h4>
                        <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg border border-stone-300 dark:border-stone-700">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="px-2.5 py-0.5 text-stone-600 dark:text-stone-300 hover:text-amber-600 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-900 dark:text-stone-100">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="px-2.5 py-0.5 text-stone-600 dark:text-stone-300 hover:text-amber-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-semibold text-stone-400 hover:text-rose-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-stone-200 dark:border-stone-800 p-5 bg-stone-50/50 dark:bg-stone-900/50">
                <div className="flex justify-between text-base font-bold text-stone-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">Taxes & shipping verified at checkout.</p>
                <button
                  type="button"
                  onClick={() => {
                    if (requireCustomerAccount()) {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }
                  }}
                  className="mt-4 w-full rounded-xl bg-stone-900 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg transition"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm"
          onClick={() => setWishlistOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 p-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">Saved Atelier Pieces</span>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">Your Wishlist ({wishlistProducts.length})</h2>
              </div>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="py-20 text-center text-stone-400">
                  <span className="text-4xl text-rose-500">♡</span>
                  <p className="mt-3 text-sm font-semibold text-stone-600 dark:text-stone-300">Your wishlist is currently empty.</p>
                  <p className="mt-1 text-xs text-stone-400">Click the heart icon on any piece to save it here.</p>
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <div key={product.id} className="flex gap-3.5 border-b border-stone-100 dark:border-stone-800 pb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-18 rounded-xl object-cover bg-stone-100 dark:bg-stone-800"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white">{product.name}</h4>
                        <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="rounded-lg bg-stone-900 hover:bg-amber-700 dark:bg-stone-800 dark:hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition"
                        >
                          Move to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Account Login / Signup Modal */}
      {accountOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4">
          <form
            onSubmit={accountMode === "create" ? createCustomerAccount : loginCustomer}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Atelier Membership</span>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-1">
                  {accountMode === "create" ? "Create Account" : "Sign In to Atelier"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3.5">
              {accountMode === "create" && (
                <input
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                  placeholder="Full Name"
                  required
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
                />
              )}
              <input
                type="email"
                name="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                placeholder="Email Address"
                required
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              <input
                type="password"
                name="password"
                value={accountForm.password}
                onChange={handleAccountChange}
                placeholder="Password"
                required
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              {accountMode === "create" && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={accountForm.confirmPassword}
                  onChange={handleAccountChange}
                  placeholder="Confirm Password"
                  required
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
                />
              )}
            </div>

            {accountError && (
              <p className="mt-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400">
                {accountError}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-stone-900 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 py-3.5 text-sm font-bold text-white transition shadow-md"
            >
              {accountMode === "create" ? "Complete Registration" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountMode(accountMode === "create" ? "login" : "create");
                setAccountError("");
              }}
              className="mt-3 w-full text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-600 text-center"
            >
              {accountMode === "create"
                ? "Already have an account? Sign In"
                : "New here? Create an Atelier Account"}
            </button>
          </form>
        </div>
      )}

      {/* Account Created Notification */}
      {accountCreated && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-8 text-center shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700 font-bold">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-bold text-stone-900 dark:text-white">Account Created</h3>
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
              Welcome to the SHIEN Atelier community. You can now save favorites, access your cart, and place orders.
            </p>
            <button
              type="button"
              onClick={() => setAccountCreated(false)}
              className="mt-5 w-full rounded-xl bg-stone-900 hover:bg-amber-700 text-white py-3 text-xs font-bold transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4">
          <form
            onSubmit={placeOrder}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Express Checkout</span>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-1">Complete Your Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Full Name"
                required
                className="rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Phone Number"
                required
                className="rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email Address"
                required
                className="sm:col-span-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              <textarea
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                placeholder="Delivery Address (Street, City, Postal Code)"
                rows="2"
                required
                className="sm:col-span-2 resize-none rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              />
              <select
                name="paymentMethod"
                value={customer.paymentMethod}
                onChange={handleCustomerChange}
                className="sm:col-span-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white outline-none focus:border-amber-600"
              >
                <option>Cash on delivery</option>
                <option>Credit or debit card</option>
                <option>Bank transfer</option>
                <option>Mobile wallet</option>
              </select>

              <div className="sm:col-span-2 flex gap-2">
                <input
                  name="coupon"
                  value={customer.coupon}
                  onChange={handleCustomerChange}
                  placeholder="Coupon code (Try SHIEN20)"
                  className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-900 dark:text-white uppercase outline-none focus:border-amber-600"
                />
                <span className={`grid place-items-center px-4 rounded-xl text-xs font-bold ${
                  couponApplied ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                }`}>
                  {couponApplied ? "20% Applied" : "SHIEN20"}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mt-5 border-t border-stone-200 dark:border-stone-800 pt-4 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>SHIEN20 Discount (20%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-2 border-t border-stone-100 dark:border-stone-800">
                <span>Total Amount</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-stone-900 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 py-3.5 text-sm font-bold text-white transition shadow-lg"
            >
              Confirm and Place Order (${orderTotal.toFixed(2)})
            </button>
          </form>
        </div>
      )}

      {/* Order Placed Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-8 text-center shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700 font-bold">
              ✓
            </div>
            <h3 className="mt-4 text-2xl font-bold text-stone-900 dark:text-white">Order Confirmed!</h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              Thank you, {lastOrderName || "esteemed customer"}. Your order has been placed successfully and is being prepared with care.
            </p>
            <button
              type="button"
              onClick={() => setOrderPlaced(false)}
              className="mt-6 w-full rounded-xl bg-stone-900 hover:bg-amber-700 text-white py-3 text-xs font-bold transition"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
