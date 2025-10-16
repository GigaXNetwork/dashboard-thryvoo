import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, ImageIcon, RefreshCcw } from "lucide-react";
import { apiRequest } from "../../Context/apiService"; // adjust import if needed

export default function MyCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/user/mybanner", "get");
      if (response.status === "success") {
        setCategories(response.data?.categories || []);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong while fetching categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for a selected category
  const fetchCategoryItems = async (categoryId) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/user/mybanner/${categoryId}`);
      console.log(response.data)
      if (response.status === "success") {
        setItems(response.data.banners || []); // adjust based on actual API response
      } else {
        setError("Failed to fetch category items");
      }
    } catch (err) {
      setError("Something went wrong while fetching category items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDownload = (imageUrl, name) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setItems([]);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {selectedCategory ? selectedCategory.name : "My Categories"}
          </h1>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : selectedCategory ? (
        items.length === 0 ? (
          <div className="text-center text-gray-600">No items found in this category.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
              >
                {/* Image or Placeholder */}
                <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Item"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon size={40} />
                      <span className="text-sm mt-2">No Image</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 flex flex-col flex-1">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 truncate"
                    >
                      {item.url}
                    </a>
                  )}
                </div>

                {/* Download */}
                <button
                  onClick={() => handleDownload(item.image, item.name)}
                  disabled={!item.image}
                  className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition 
                    ${
                      item.image
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Download size={16} />
                  {item.image ? "Download Image" : "No Image Available"}
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        /* CATEGORY VIEW */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => {
                setSelectedCategory(category);
                fetchCategoryItems(category._id);
              }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-4 flex flex-col justify-between"
            >
              <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={40} />
                    <span className="text-sm mt-2">No Image</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(category.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
