import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, ImageIcon, RefreshCcw, Video, FileText, Search, X } from "lucide-react";
import { apiRequest } from "../../Context/apiService";
import Pagination from "../Common/Pagination";
import { Eye } from "lucide-react";


export default function MyCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Pagination state for categories
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [categoriesPerPage] = useState(10);
  const [totalCategoryPages, setTotalCategoryPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Pagination state for items
  const [currentItemPage, setCurrentItemPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItemPages, setTotalItemPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch all categories with pagination and search
  const fetchCategories = async (page = 1, search = '') => {
    try {
      setLoading(true);
      let url = `/api/user/mybanner?page=${page}&limit=${categoriesPerPage}`;

      // Add search parameter if search term exists
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await apiRequest(url, "get");
      if (response.status === "success") {
        setCategories(response.data?.categories || []);
        setTotalCategoryPages(response.data?.pagination?.totalPages || 1);
        setTotalCategories(response.data?.pagination?.totalResults || response.data?.categories?.length || 0);
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

  // Fetch items for a selected category with pagination
  const fetchCategoryItems = async (categoryId, page = 1) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/user/mybanner/${categoryId}?page=${page}&limit=${itemsPerPage}`);

      if (response.status === "success") {
        setItems(response.data.banners || []);
        setTotalItemPages(response.data?.totalPages || 1);
        setTotalItems(response.data?.totalBanners || response.data?.banners?.length || 0);
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
    fetchCategories(currentCategoryPage, searchTerm);
  }, [currentCategoryPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentCategoryPage(1); // Reset to first page when searching
      fetchCategories(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentCategoryPage(1);
  };

  // Handle category page change
  const handleCategoryPageChange = (newPage) => {
    setCurrentCategoryPage(newPage);
  };

  // Handle item page change
  const handleItemPageChange = (newPage) => {
    setCurrentItemPage(newPage);
    if (selectedCategory) {
      fetchCategoryItems(selectedCategory._id, newPage);
    }
  };

  // When selecting a category, reset to first page and fetch items
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentItemPage(1); // Reset to first page when selecting category
    fetchCategoryItems(category._id, 1);
  };

  // Count items by type for each category
  const getCategoryItemCounts = (categoryId) => {
    // Since we don't have items in categories response, we'll need to fetch counts differently  // TODO
    return { images: 0, videos: 0, total: 0 };
  };

  const getUniqueCategories = () => {
    if (categories.length > 0) {
      return categories.map(category => ({
        ...category,
        counts: getCategoryItemCounts(category._id)
      }));
    }
    return [];
  };

  const handleDownload = async (imageUrl, name) => {
    if (!imageUrl) return;

    try {
      // Method 2: Use fetch but preserve original file
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Get the original content type and size
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');

      // Create blob with exact same content type
      const blob = await response.blob();

      // Create object URL with original content type
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${name || 'image'}.jpg`;

      // Force download with right-click save as behavior
      link.style.display = 'none';
      document.body.appendChild(link);

      // Use setTimeout to ensure the click happens
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

    } catch (err) {
      console.error('Download failed:', err);

      // Final fallback: Simple direct download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${name || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get YouTube video ID for embedding
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#&?]{11})/,
      /(?:youtube\.com\/embed\/)([^#&?]{11})/,
      /(?:youtube\.com\/v\/)([^#&?]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setItems([]);
                setCurrentItemPage(1);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {selectedCategory ? `Items in ${selectedCategory.name}` : "My Categories"}
            </h1>
            {!selectedCategory ? (
              <p className="text-gray-600 mt-1">
                Showing {categories.length} of {totalCategories} categories{totalCategoryPages > 1 ? ` • Page ${currentCategoryPage} of ${totalCategoryPages}` : ''}
                {searchTerm && ` • Searching for "${searchTerm}"`}
              </p>
            ) : (
              <p className="text-gray-600 mt-1">
                Showing {items.length} of {totalItems} items{totalItemPages > 1 ? ` • Page ${currentItemPage} of ${totalItemPages}` : ''}
              </p>
            )}
          </div>
        </div>

        {!selectedCategory && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading / Error States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
          <span className="text-gray-600 text-lg">Loading...</span>
          <span className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : selectedCategory ? (
        items.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">No items found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
                >
                  {/* Media Preview */}
                  <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.type === 'image' && item.url ? (
                      <img
                        src={item.url}
                        alt={item.name || "Item"}
                        className="w-full h-full object-cover"
                      />

                    ) : item.type === 'video' && item.url ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        {getYouTubeVideoId(item.url) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
                            title={item.name || "YouTube video"}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <Video className="w-12 h-12 text-white" />
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={40} />
                        <span className="text-sm mt-2">No Media</span>
                      </div>
                    )}
                    {/* Eye icon to preview full size */}
                    <button
                      onClick={() => setPreviewImage(item.url)}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                      title="View full image"
                    >
                      <Eye size={18} />
                    </button>


                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {item.type === 'image' ? 'Image' : 'Video'}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="mt-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {item.name || 'Unnamed Item'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Download Button - Only show for images */}
                  {item.type === 'image' && item.url && (
                    <button
                      onClick={() => handleDownload(item.url, item.name || 'image')}
                      className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                    >
                      <Download size={16} />
                      Download Image
                    </button>
                  )}

                  {/* Visit Link Button for Videos */}
                  {item.type === 'video' && item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition text-center"
                    >
                      <Video size={16} />
                      Visit Link
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination for Items */}
            {totalItemPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentItemPage}
                  totalPages={totalItemPages}
                  onPageChange={handleItemPageChange}
                />
              </div>
            )}
          </>
        )
      ) : (
        /* CATEGORY VIEW - Updated design without images */
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getUniqueCategories().length === 0 ? (
              <div className="text-center text-gray-600 py-12 col-span-full">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No categories found' : 'No categories yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Categories will appear here once created'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              getUniqueCategories().map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategorySelect(category)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-6 flex flex-col justify-between min-h-[180px] hover:border-blue-300"
                >
                  {/* Category Name */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize truncate">
                      {category.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Item Counts - Placeholder for now */}
                  {/* <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Total Items:</span>
                      <span className="font-bold text-gray-900">-</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <ImageIcon className="w-4 h-4 text-green-600" />
                        <span>Images:</span>
                      </div>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Video className="w-4 h-4 text-blue-600" />
                        <span>Videos:</span>
                      </div>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>
                  </div> */}

                  {/* Click Hint */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-blue-600 text-center font-medium">
                      Click to view items
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination for Categories */}
          {totalCategoryPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentCategoryPage}
                totalPages={totalCategoryPages}
                onPageChange={handleCategoryPageChange}
              />
            </div>
          )}
        </>
      )}
      {previewImage && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
          >
            <X size={28} />
          </button>

          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}