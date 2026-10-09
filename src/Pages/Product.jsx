import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSelector from "../Components/ThemeSelector";

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
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || [],
  );
  const [categories, setCategories] = useState(() => {
    const savedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    const productCategories = products
      .map((item) => item.category)
      .filter(Boolean);
    return [...new Set([...savedCategories, ...productCategories])];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [product, setProduct] = useState(createEmptyProduct);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("loggedin");
    navigate("/Login");
  }

  function handleProductFieldChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function handleAddCategory() {
    const categoryName = newCategory.trim();

    if (!categoryName) {
      return;
    }

    const existingCategory = categories.find(
      (category) => category.toLowerCase() === categoryName.toLowerCase(),
    );

    if (existingCategory) {
      setProduct((currentProduct) => ({
        ...currentProduct,
        category: existingCategory,
      }));
    } else {
      setCategories((currentCategories) => [
        ...currentCategories,
        categoryName,
      ]);
      setProduct((currentProduct) => ({
        ...currentProduct,
        category: categoryName,
      }));
    }

    setNewCategory("");
  }

  function handleDeleteCategory(categoryToDelete) {
    const shouldDelete = window.confirm(
      `Delete the category "${categoryToDelete}" from the dropdown? Existing products will keep this category.`,
    );

    if (!shouldDelete) {
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category !== categoryToDelete),
    );

    if (product.category === categoryToDelete) {
      setProduct((currentProduct) => ({ ...currentProduct, category: "" }));
    }
  }

  function openAddForm() {
    setEditingId(null);
    setProduct(createEmptyProduct());
    setProductImage("");
    setNewCategory("");
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
    setNewCategory("");
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

  const inputClass =
    "w-full rounded-lg px-4 py-3 outline-none border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary";

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
          <Link
            to="/Dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-lg transition ${
              darkMode
                ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link
            to="/product"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg bg-primary px-4 py-3 text-primary-content"
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
          {[["Settings", "#"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={`block px-4 py-3 rounded-lg transition ${
                darkMode
                  ? "text-base-content/80 hover:bg-base-200 hover:text-primary"
                  : "text-base-content/70 hover:bg-base-200 hover:text-primary"
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

      <main className="min-w-0 flex-1 bg-base-200 p-3 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-2xl leading-none shadow-sm transition md:hidden ${
                  darkMode
                    ? "border-base-300 bg-base-200 text-primary hover:bg-base-300"
                    : "border-base-300 bg-base-100 text-primary hover:bg-base-200"
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

        <section className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm mb-8 sm:p-6">
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
              className="btn btn-primary w-full sm:w-auto"
            >
              {showForm ? "CLOSE FORM" : "+ ADD PRODUCT"}
            </button>
          </div>
        </section>

        {showForm && (
          <section className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm mb-8 sm:p-6">
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
                      <div className="text-primary text-4xl mb-2">+</div>
                      <p className="text-primary font-semibold">
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
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-base-content">
                    Category
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleProductFieldChange}
                    className={`${inputClass} select select-bordered`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="badge badge-outline h-auto gap-2 py-2"
                        >
                          <span>{category}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category)}
                            className="text-error hover:opacity-70"
                            aria-label={`Delete ${category} category`}
                            title={`Delete ${category}`}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      placeholder="Create a new category"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="btn btn-secondary w-full sm:w-auto"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleProductFieldChange}
                  placeholder="Enter product description"
                  rows="3"
                  className={`${inputClass} resize-none`}
                />
                <button type="submit" className="btn btn-primary w-full">
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
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center sm:p-10">
              <div className="text-5xl mb-4">📦</div>
              <h4 className="text-lg font-bold">No Products Yet</h4>
              <p className="mt-2 mb-5">
                Add your first product to display it here.
              </p>
              <button onClick={openAddForm} className="btn btn-primary">
                + Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-82 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <span className="badge badge-primary mb-3">
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
                        className="btn btn-primary min-h-10 flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="btn btn-error btn-outline min-h-10 flex-1"
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
