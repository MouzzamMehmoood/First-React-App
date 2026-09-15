import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const createEmptyProduct = () => ({
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
});

const Product = () => {
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem("Name"));
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || [],
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [product, setProduct] = useState(createEmptyProduct);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("loggedin");
    navigate("/login");
  }

  function handleProductFieldChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function openAddForm() {
    setEditingId(null);
    setProduct(createEmptyProduct());
    setProductImage("");
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    setProduct({
      name: item.name,
      price: item.price,
      category: item.category,
      stock: item.stock,
      description: item.description,
    });
    setProductImage(item.image);
    setShowForm(true);
  }

  function handleProductSubmit(e) {
    e.preventDefault();

    if (!product.name || !product.price || !productImage) {
      alert("Please add product name, price and image");
      return;
    }

    if (editingId) {
      setProducts((currentProducts) =>
        currentProducts.map((productItem) =>
          productItem.id === editingId
            ? { ...productItem, ...product, image: productImage }
            : productItem,
        ),
      );
    } else {
      setProducts((currentProducts) => [
        ...currentProducts,
        { id: Date.now(), ...product, image: productImage },
      ]);
    }

    setProduct(createEmptyProduct());
    setProductImage("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleDeleteProduct(id) {
    setProducts((currentProducts) =>
      currentProducts.filter((productItem) => productItem.id !== id),
    );
  }

  const inputClass = `w-full rounded-lg px-4 py-3 outline-none border ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-800"
  } focus:border-blue-600`;

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-800"
      }`}
    >
      <aside
        className={`${mobileMenuOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 w-72 border-r flex-col p-6 transition-transform duration-300 md:static md:flex md:w-64 ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-blue-600">DASHBOARD</h1>
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
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Home
          </Link>
          <Link
            to="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-lg bg-blue-600 text-white"
          >
            Products
          </Link>
          {[
            ["Orders", "#"],
            ["Customers", "#"],
            ["Settings", "#"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={`block px-4 py-3 rounded-lg transition ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {label}
            </a>
          ))}
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

      <main
        className={`min-w-0 flex-1 p-3 sm:p-6 lg:p-8 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-2xl leading-none shadow-sm transition md:hidden ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 text-blue-400 hover:bg-gray-700"
                    : "border-blue-100 bg-white text-blue-600 hover:bg-blue-50"
                }`}
                aria-label="Open navigation menu"
              >
                ☰
              </button>
              <h2
                className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Products
              </h2>
            </div>
            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Welcome back! <span className="text-blue-600">{name}</span>
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex-1 px-3 py-3 text-sm sm:flex-none sm:px-5 sm:text-base rounded-lg font-medium transition ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              {darkMode ? " LIGHT MODE" : " DARK MODE"}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-blue-600 text-white px-3 py-3 text-sm sm:flex-none sm:px-5 sm:text-base rounded-lg hover:bg-blue-700 transition"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <section
          className={`rounded-2xl p-4 sm:p-6 shadow-sm border mb-8 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Product Management
              </h3>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Add and manage your products
              </p>
            </div>
            <button
              onClick={showForm ? () => setShowForm(false) : openAddForm}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {showForm ? "CLOSE FORM" : "+ ADD PRODUCT"}
            </button>
          </div>
        </section>

        {showForm && (
          <section
            className={`rounded-2xl p-4 sm:p-6 shadow-sm border mb-8 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <form
              onSubmit={handleProductSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Product Image
                </label>
                <div className="w-full h-56 sm:h-80 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-blue-600 text-4xl mb-2">+</div>
                      <p className="text-blue-600 font-semibold">
                        Paste an image address below
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="Paste image address here"
                  aria-label="Product image URL"
                  className={`${inputClass} mt-4`}
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleProductFieldChange}
                  placeholder="Enter product name"
                  className={inputClass}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleProductFieldChange}
                    placeholder="Enter price"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleProductFieldChange}
                    placeholder="Stock quantity"
                    className={inputClass}
                  />
                </div>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleProductFieldChange}
                  placeholder="e.g. Electronics"
                  className={inputClass}
                />
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleProductFieldChange}
                  placeholder="Enter product description"
                  rows="3"
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Products
              </h3>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total Products: {products.length}
              </p>
            </div>
          </div>
          {products.length === 0 ? (
            <div
              className={`rounded-2xl border p-6 sm:p-10 text-center ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="text-5xl mb-4">📦</div>
              <h4 className="text-lg font-bold">No Products Yet</h4>
              <p className="mt-2 mb-5">
                Add your first product to display it here.
              </p>
              <button
                onClick={openAddForm}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                + Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
                >
                  <div className="relative h-82 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {item.category || "Uncategorized"}
                    </span>
                    <h4
                      className={`text-lg font-bold truncate ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {item.name}
                    </h4>
                    <p
                      className={`text-sm mt-2 line-clamp-2 min-h-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {item.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between gap-3 mt-5">
                      <span className="font-bold text-xl">${item.price}</span>
                      <span className="text-sm">Stock: {item.stock || 0}</span>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => openEditForm(item)}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg hover:bg-red-100 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Product;
