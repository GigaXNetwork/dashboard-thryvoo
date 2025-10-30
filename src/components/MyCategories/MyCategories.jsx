// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Download, ImageIcon, RefreshCcw } from "lucide-react";
// import { apiRequest } from "../../Context/apiService"; // adjust import if needed

// export default function MyCategories() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest("/api/user/mybanner", "get");
//       if (response.status === "success") {
//         setCategories(response.data?.categories || []);
//       } else {
//         setError("Failed to fetch categories");
//       }
//     } catch (err) {
//       console.log(err)
//       setError("Something went wrong while fetching categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch items for a selected category
//   const fetchCategoryItems = async (categoryId) => {
//     try {
//       setLoading(true);
//       const response = await apiRequest(`/api/user/mybanner/${categoryId}`);
//       console.log(response.data)
//       if (response.status === "success") {
//         setItems(response.data.banners || []); // adjust based on actual API response
//       } else {
//         setError("Failed to fetch category items");
//       }
//     } catch (err) {
//       setError("Something went wrong while fetching category items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleDownload = (imageUrl, name) => {
//     if (!imageUrl) return;
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${name}.jpg`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           {selectedCategory && (
//             <button
//               onClick={() => {
//                 setSelectedCategory(null);
//                 setItems([]);
//               }}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded-full transition"
//             >
//               <ArrowLeft size={20} />
//             </button>
//           )}
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//             {selectedCategory ? selectedCategory.name : "My Categories"}
//           </h1>
//         </div>
//       </div>

//       {/* Loading / Error States */}
//       {loading ? (
//         <div className="flex items-center justify-center h-64 text-gray-500">
//           Loading...
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : selectedCategory ? (
//         items.length === 0 ? (
//           <div className="text-center text-gray-600">No items found in this category.</div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {items.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
//               >
//                 {/* Image or Placeholder */}
//                 <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.name || "Item"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-gray-400 flex flex-col items-center">
//                       <ImageIcon size={40} />
//                       <span className="text-sm mt-2">No Image</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="mt-4 flex flex-col flex-1">
//                   {item.url && (
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-600 hover:underline mt-1 truncate"
//                     >
//                       {item.url}
//                     </a>
//                   )}
//                 </div>

//                 {/* Download */}
//                 <button
//                   onClick={() => handleDownload(item.image, item.name)}
//                   disabled={!item.image}
//                   className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition 
//                     ${item.image
//                       ? "bg-indigo-600 hover:bg-indigo-700 text-white"
//                       : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                 >
//                   <Download size={16} />
//                   {item.image ? "Download Image" : "No Image Available"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         )
//       ) : (
//         /* CATEGORY VIEW */
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {categories.length === 0 ? (
//             <div className="text-center text-gray-600">No items found in this category.</div>
//           ) : (
//             categories.map((category) => (
//               <div
//                 key={category._id}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   fetchCategoryItems(category._id);
//                 }}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-4 flex flex-col justify-between"
//               >
//                 <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
//                   {category.image ? (
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-gray-400 flex flex-col items-center">
//                       <ImageIcon size={40} />
//                       <span className="text-sm mt-2">No Image</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     {category.name}
//                   </h2>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Created: {new Date(category.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Download, ImageIcon, RefreshCcw, Video, FileText } from "lucide-react";
// import { apiRequest } from "../../Context/apiService";

// export default function MyCategories() {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest("/api/user/mybanner", "get");
//       if (response.status === "success") {
//         setCategories(response.data?.categories || []);
//       } else {
//         setError("Failed to fetch categories");
//       }
//     } catch (err) {
//       console.log(err)
//       setError("Something went wrong while fetching categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch items for a selected category
//   const fetchCategoryItems = async (categoryId) => {
//     try {
//       setLoading(true);
//       const response = await apiRequest(`/api/user/mybanner/${categoryId}`);
//       console.log("Category items response:", response.data);
//       if (response.status === "success") {
//         setItems(response.data.banners || []); // This should contain the items array
//       } else {
//         setError("Failed to fetch category items");
//       }
//     } catch (err) {
//       setError("Something went wrong while fetching category items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Count items by type for each category
//   const getCategoryItemCounts = (categoryId) => {
//     // Since we don't have items in categories response, we'll need to fetch counts differently  // TODO
//     return { images: 0, videos: 0, total: 0 };
//   };

//   const getUniqueCategories = () => {
//     if (categories.length > 0) {
//       return categories.map(category => ({
//         ...category,
//         counts: getCategoryItemCounts(category._id)
//       }));
//     }
//     return [];
//   };

//   const handleDownload = async (imageUrl, name) => {
//     if (!imageUrl) return;

//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();

//       const blobUrl = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `${name || 'image'}.jpg`;

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(blobUrl);

//     } catch (err) {
//       console.error('Download failed:', err);
//       // Fallback: simple download method
//       const link = document.createElement("a");
//       link.href = imageUrl;
//       link.download = `${name || 'image'}.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Get YouTube video ID for embedding
//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const patterns = [
//       /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#&?]{11})/,
//       /(?:youtube\.com\/embed\/)([^#&?]{11})/,
//       /(?:youtube\.com\/v\/)([^#&?]{11})/,
//     ];
//     for (const pattern of patterns) {
//       const match = url.match(pattern);
//       if (match && match[1]) {
//         return match[1];
//       }
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           {selectedCategory && (
//             <button
//               onClick={() => {
//                 setSelectedCategory(null);
//                 setItems([]);
//               }}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded-full transition"
//             >
//               <ArrowLeft size={20} />
//             </button>
//           )}
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//             {selectedCategory ? `Items in ${selectedCategory.name}` : "My Categories"}
//           </h1>
//         </div>
//       </div>

//       {/* Loading / Error States */}
//       {loading ? (
//         <div className="flex items-center justify-center h-64 text-gray-500">
//           Loading...
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : selectedCategory ? (
//         /* ITEMS VIEW */
//         items.length === 0 ? (
//           <div className="text-center text-gray-600 py-12">
//             <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//             <p className="text-lg">No items found in this category.</p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {items.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
//               >
//                 {/* Media Preview */}
//                 <div className="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
//                   {item.type === 'image' && item.url ? (
//                     <img
//                       src={item.url}
//                       alt={item.name || "Item"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : item.type === 'video' && item.url ? (
//                     <div className="w-full h-full bg-gray-900 flex items-center justify-center">
//                       {getYouTubeVideoId(item.url) ? (
//                         <iframe
//                           src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
//                           title={item.name || "YouTube video"}
//                           className="w-full h-full"
//                           frameBorder="0"
//                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                           allowFullScreen
//                         />
//                       ) : (
//                         <Video className="w-12 h-12 text-white" />
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-gray-400 flex flex-col items-center">
//                       <ImageIcon size={40} />
//                       <span className="text-sm mt-2">No Media</span>
//                     </div>
//                   )}

//                   {/* Type Badge */}
//                   <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
//                     {item.type === 'image' ? 'Image' : 'Video'}
//                   </div>
//                 </div>

//                 {/* Item Info */}
//                 <div className="mt-4 flex flex-col flex-1">
//                   <h3 className="font-semibold text-gray-900 text-sm mb-2">
//                     {item.name || 'Unnamed Item'}
//                   </h3>
//                   <p className="text-xs text-gray-500">
//                     Added: {new Date(item.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>

//                 {/* Download Button - Only show for images */}
//                 {item.type === 'image' && item.url && (
//                   <button
//                     onClick={() => handleDownload(item.url, item.name || 'image')}
//                     className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
//                   >
//                     <Download size={16} />
//                     Download Image
//                   </button>
//                 )}

//                 {/* Visit Link Button for Videos */}
//                 {item.type === 'video' && item.url && (
//                   <a
//                     href={item.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition text-center"
//                   >
//                     <Video size={16} />
//                     Visit Link
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         )
//       ) : (
//         /* CATEGORY VIEW - Updated design without images */
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {getUniqueCategories().length === 0 ? (
//             <div className="text-center text-gray-600 py-12 col-span-full">
//               <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//               <p className="text-lg">No categories found.</p>
//             </div>
//           ) : (
//             getUniqueCategories().map((category) => (
//               <div
//                 key={category._id}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   fetchCategoryItems(category._id);
//                 }}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition p-6 flex flex-col justify-between min-h-[180px] hover:border-blue-300"
//               >
//                 {/* Category Name */}
//                 <div className="text-center mb-4">
//                   <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize truncate">
//                     {category.name}
//                   </h2>
//                   <p className="text-xs text-gray-500">
//                     Created: {new Date(category.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>

//                 {/* Item Counts - Placeholder for now */}
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600 font-medium">Total Items:</span>
//                     <span className="font-bold text-gray-900">-</span>
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <ImageIcon className="w-4 h-4 text-green-600" />
//                       <span>Images:</span>
//                     </div>
//                     <span className="font-semibold text-gray-900">-</span>
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <Video className="w-4 h-4 text-blue-600" />
//                       <span>Videos:</span>
//                     </div>
//                     <span className="font-semibold text-gray-900">-</span>
//                   </div>
//                 </div>

//                 {/* Click Hint */}
//                 <div className="mt-4 pt-3 border-t border-gray-100">
//                   <p className="text-xs text-blue-600 text-center font-medium">
//                     Click to view items
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, ImageIcon, RefreshCcw, Video, FileText } from "lucide-react";
import { apiRequest } from "../../Context/apiService";
import Pagination from "../Common/Pagination";

export default function MyCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Fetch all categories with pagination
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/user/mybanner?page=${page}&limit=${categoriesPerPage}`, "get");
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
      console.log("Category items response:", response.data);
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
    fetchCategories(currentCategoryPage);
  }, [currentCategoryPage]);

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
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${name || 'image'}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: simple download method
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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setItems([]);
                setCurrentItemPage(1); // Reset item page when going back
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {selectedCategory ? `Items in ${selectedCategory.name}` : "My Categories"}
            </h1>
            {!selectedCategory ? (
              <p className="text-gray-600 mt-1">
                Showing {categories.length} of {totalCategories} categories{totalCategoryPages > 1 ? ` • Page ${currentCategoryPage} of ${totalCategoryPages}` : ''}
              </p>
            ) : (
              <p className="text-gray-600 mt-1">
                Showing {items.length} of {totalItems} items{totalItemPages > 1 ? ` • Page ${currentItemPage} of ${totalItemPages}` : ''}
              </p>
            )}
          </div>
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
        /* ITEMS VIEW */
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
                <p className="text-lg">No categories found.</p>
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
                  <div className="space-y-3">
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
                  </div>

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
    </div>
  );
}