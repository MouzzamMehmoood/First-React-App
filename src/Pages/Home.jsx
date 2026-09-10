import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem("Name"));

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImage, setProductImage] = useState("");
  const productInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  function out(e) {
    e.preventDefault();
    navigate("/Login");
    localStorage.removeItem("loggedin");
  }

  function handleProductChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  function handleProductImage(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProductImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }

  function openAddForm() {
    setEditingId(null);

    setProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
    });

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

  function saveProduct(e) {
    e.preventDefault();

    if (!product.name || !product.price || !productImage) {
      alert("Please add product name, price and image");
      return;
    }

    if (editingId) {
      setProducts(
        products.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...product,
                image: productImage,
              }
            : item,
        ),
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...product,
        image: productImage,
      };

      setProducts([...products, newProduct]);
    }

    setProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
    });

    setProductImage("");
    setEditingId(null);
    setShowForm(false);
  }

  function deleteProduct(id) {
    setProducts(products.filter((item) => item.id !== id));
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-800"
      }`}
    >
      <aside
        className={`hidden md:flex w-64 border-r flex-col p-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-10">DASHBOARD</h1>

        <nav className="space-y-3">
          <a
            href="#"
            className="block px-4 py-3 rounded-lg bg-blue-600 text-white"
          >
            Home
          </a>

          <a
            href="#products"
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Products
          </a>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Orders
          </a>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Customers
          </a>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Settings
          </a>
        </nav>
      </aside>

      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
          darkMode ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2
              className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Home
            </h2>

            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Welcome back! <span className="text-blue-600">{name}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-5 py-3 rounded-lg font-medium transition ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {darkMode ? " LIGHT MODE" : " DARK MODE"}
            </button>

            <button
              onClick={out}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <section
          className={`rounded-2xl p-5 sm:p-6 shadow-sm border mb-8 transition-colors duration-300 ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Product Management
              </h3>

              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Add and manage your products
              </p>
            </div>

            <button
              onClick={showForm ? () => setShowForm(false) : openAddForm}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {showForm ? "CLOSE FORM" : "+ ADD PRODUCT"}
            </button>
          </div>
        </section>

        {showForm && (
          <section
            className={`rounded-2xl p-5 sm:p-6 shadow-sm border mb-8 transition-colors duration-300 ${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-100"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>

            <form
              onSubmit={saveProduct}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Product Image
                </label>

                <div
                  onClick={() => productInputRef.current.click()}
                  className="w-full h-80 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition"
                >
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
                        Upload Product Image
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={productInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImage}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    placeholder="Enter product name"
                    className={`w-full rounded-lg px-4 py-3 outline-none border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:border-blue-600`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleProductChange}
                      placeholder="Enter price"
                      className={`w-full rounded-lg px-4 py-3 outline-none border ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-800"
                      } focus:border-blue-600`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={product.stock}
                      onChange={handleProductChange}
                      placeholder="Stock quantity"
                      className={`w-full rounded-lg px-4 py-3 outline-none border ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-800"
                      } focus:border-blue-600`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleProductChange}
                    placeholder="e.g. Electronics"
                    className={`w-full rounded-lg px-4 py-3 outline-none border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:border-blue-600`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleProductChange}
                    placeholder="Enter product description"
                    rows="3"
                    className={`w-full rounded-lg px-4 py-3 outline-none border resize-none ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:border-blue-600`}
                  />
                </div>

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

        <section id="products">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Products
              </h3>

              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total Products: {products.length}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="text-5xl mb-4">📦</div>

              <h4
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                No Products Yet
              </h4>

              <p
                className={`mt-2 mb-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
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
                  className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition ${
                    darkMode
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="relative h-82 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {item.category || "Uncategorized"}
                    </span>

                    <h4
                      className={`text-lg font-bold truncate ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </h4>

                    <p
                      className={`text-sm mt-2 line-clamp-2 min-h-[40px] ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {item.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between mt-5">
                      <span
                        className={`font-bold text-xl ${
                          darkMode ? " text-white" : "text-gray-700"
                        }`}
                      >
                        ${item.price}
                      </span>

                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Stock: {item.stock || 0}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => openEditForm(item)}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(item.id)}
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

export default Home;
