// import React, { useState, useEffect } from 'react';
// import {
//   Plus, Eye, Search, X, Loader, AlertCircle, FolderOpen, Edit,
//   Image as ImageIcon, Link as LinkIcon, Trash2, List, Video
// } from 'lucide-react';
// import CategoryModal from './CategoryModal';
// import ItemModal from './ItemModal';
// import { Api } from "../../../Context/apiService";
// import Pagination from '../../Common/Pagination';
// import { useUser } from '../../../Context/ContextApt';
// import { useParams } from 'react-router';
// import { toast } from 'react-toastify';
// import DeleteConfirmationModal from '../../Common/DeleteConfirmationModal';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showItemModal, setShowItemModal] = useState(false);
//   const [modalMode, setModalMode] = useState('view');
//   const [modalCategory, setModalCategory] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [viewingItems, setViewingItems] = useState(null);
//   const [itemsLoading, setItemsLoading] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   console.log("cate", categories)

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);

//   const { userId } = useParams();

//   // Fetch categories
//   const fetchCategories = async () => {
//     if (!userId) {
//       setError('User ID not available');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await Api.getCategories(userId, currentPage, itemsPerPage, searchTerm);
//       const categoriesData = response.data;
//       setCategories(categoriesData.categories || []);
//       setTotalPages(categoriesData.pagination?.totalPages || 1);
//       setTotalResults(categoriesData.pagination?.totalResults || categoriesData.categories?.length || 0);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch items for a specific category
//   const fetchCategoryItems = async (categoryId) => {
//     if (!userId || !categoryId) return;

//     try {
//       setItemsLoading(true);
//       const response = await Api.getCategoryItems(userId, categoryId);

//       setViewingItems(prev => ({
//         ...prev,
//         items: response.data.banners || []
//       }));
//     } catch (err) {
//       console.error('Failed to fetch category items:', err);
//       setError('Failed to load items');
//     } finally {
//       setItemsLoading(false);
//     }
//   };

//   useEffect(() => { fetchCategories(); }, [currentPage, searchTerm]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setCurrentPage(1);
//       fetchCategories();
//     }, 500);
//     return () => clearTimeout(timeout);
//   }, [searchTerm]);

//   const handlePageChange = (newPage) => setCurrentPage(newPage);

//   // Category CRUD
//   const handleCreateCategory = async (formData) => {
//     try {
//       setSubmitting(true);
//       await Api.createCategory(userId, formData);
//       toast.success('Category created successfully!');
//       setShowCategoryModal(false);
//       fetchCategories();
//     } catch (err) {
//       console.log(err)
//       toast.error('Failed to create category');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEditCategory = async (formData) => {
//     try {
//       setSubmitting(true);
//       await Api.updateCategory(modalCategory._id, formData);
//       toast.success('Category updated successfully!');
//       setShowCategoryModal(false);
//       setModalCategory(null);
//       fetchCategories();
//     } catch (err) {
//       console.log(err)
//       toast.error('Failed to update category');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCategorySubmit = (formData) => {
//     if (modalMode === 'edit') handleEditCategory(formData);
//     else handleCreateCategory(formData);
//   };

//   // Item CRUD
//   const handleAddItem = async (category, formData) => {
//     try {
//       setSubmitting(true);
//       await Api.addItemToCategory(userId, category._id, formData);
//       toast.success('Item added successfully!');
//       setShowItemModal(false);
//       // Refresh the items for this category
//       await fetchCategoryItems(category._id);
//     } catch (err) {
//       console.error('Error adding item:', err);
//       toast.error('Failed to add item');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteItem = (category, itemId) => {
//     setSelectedCategory(category);
//     setSelectedItem(itemId);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedCategory?._id || !selectedItem) return;

//     try {
//       await Api.deleteItemFromCategory(userId, selectedCategory._id, selectedItem);
//       toast.success('Item deleted successfully!');
//       await fetchCategoryItems(selectedCategory._id);
//     } catch (err) {
//       console.error('Error deleting item:', err);
//       toast.error('Failed to delete item');
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   // Modal handlers
//   const handleViewCategory = (category) => {
//     setModalCategory(category);
//     setModalMode('view');
//     setShowCategoryModal(true);
//   };

//   const handleEditFromModal = () => setModalMode('edit');

//   const handleCreateCategoryClick = () => {
//     setShowCategoryModal(true);
//     setModalCategory(null);
//     setModalMode('create');
//   };

//   const handleViewItems = async (category) => {
//     setViewingItems(category);
//     // Fetch items for this category
//     await fetchCategoryItems(category._id);
//   };

//   const handleAddItemClick = (category) => {
//     setModalCategory(category);
//     setShowItemModal(true);
//   };

//   const handleBackToCategories = () => {
//     setViewingItems(null);
//   };

//   const handleModalClose = () => {
//     setShowCategoryModal(false);
//     setShowItemModal(false);
//     setModalMode('view');
//     setModalCategory(null);
//   };

//   const clearSearch = () => setSearchTerm('');

//   // YouTube URL parsing function
//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;

//     // Handle various YouTube URL formats
//     const patterns = [
//       /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#&?]{11})/, // youtu.be/ABC123 or youtube.com/watch?v=ABC123
//       /(?:youtube\.com\/embed\/)([^#&?]{11})/, // youtube.com/embed/ABC123
//       /(?:youtube\.com\/v\/)([^#&?]{11})/, // youtube.com/v/ABC123
//     ];

//     for (const pattern of patterns) {
//       const match = url.match(pattern);
//       if (match && match[1]) {
//         return match[1];
//       }
//     }

//     return null;
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   return (
//     <>
//       {loading ? (
//         <div className="flex items-center justify-center min-h-64">
//           <Loader className="w-8 h-8 animate-spin text-blue-600" />
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto p-6">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {viewingItems ? `Items in ${viewingItems.name}` : 'Categories'}
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 {viewingItems
//                   ? `Showing ${viewingItems.items?.length || 0} items`
//                   : `Showing ${categories.length} of ${totalResults} categories${totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ''}`
//                 }
//               </p>
//             </div>

//             {viewingItems ? (
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleBackToCategories}
//                   className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
//                 >
//                   <List className="w-4 h-4" />
//                   Back to Categories
//                 </button>
//                 <button
//                   onClick={() => handleAddItemClick(viewingItems)}
//                   className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Item
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
//                 {/* Search Input */}
//                 <div className="relative w-full sm:w-64">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Search categories..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {searchTerm && (
//                     <button
//                       onClick={clearSearch}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//                 {/* Add Category Button */}
//                 <button
//                   onClick={handleCreateCategoryClick}
//                   className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Category
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Messages */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
//               <AlertCircle className="w-5 h-5" />
//               {error}
//               <button onClick={() => setError('')} className="ml-auto">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//           {message && (
//             <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.includes('✅')
//               ? 'bg-green-50 text-green-700 border border-green-200'
//               : 'bg-red-50 text-red-700 border border-red-200'
//               }`}>
//               {message}
//             </div>
//           )}

//           {/* Items View */}
//           {viewingItems && (
//             <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//               {itemsLoading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader className="w-8 h-8 animate-spin text-blue-600" />
//                 </div>
//               ) : (!viewingItems.items || viewingItems.items.length === 0) ? (
//                 <div className="text-center py-12">
//                   <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
//                   <p className="text-gray-500 mb-4">
//                     Get started by adding your first item to this category
//                   </p>
//                   <button
//                     onClick={() => handleAddItemClick(viewingItems)}
//                     className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add First Item
//                   </button>
//                 </div>
//               ) : (
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {viewingItems.items.map((item) => (
//                       <div
//                         key={item._id}
//                         className="bg-gray-50 rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition"
//                       >
//                         {/* Item Header */}
//                         <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
//                           <div className="flex items-center gap-2">
//                             {item.type === 'image' ? (
//                               <>
//                                 <ImageIcon className="w-4 h-4 text-green-600" />
//                                 <span className="text-sm font-medium text-gray-700">Image</span>
//                               </>
//                             ) : item.type === 'video' ? (
//                               <>
//                                 <Video className="w-4 h-4 text-blue-600" />
//                                 <span className="text-sm font-medium text-gray-700">Video</span>
//                               </>
//                             ) : null}
//                           </div>
//                           <button
//                             onClick={() => handleDeleteItem(viewingItems, item._id)}
//                             className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
//                             title="Delete item"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>

//                         {/* Item Content */}
//                         <div className="p-4">
//                           {item.type === 'image' ? (
//                             <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
//                               <img
//                                 src={item.url}
//                                 alt={item.name || 'Item image'}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : item.type === 'video' ? (
//                             <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
//                               {getYouTubeVideoId(item.url) ? (
//                                 <iframe
//                                   src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
//                                   title={item.name || 'YouTube video'}
//                                   className="w-full h-full"
//                                   frameBorder="0"
//                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                   allowFullScreen
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-white">
//                                   <div className="text-center">
//                                     <Video className="w-8 h-8 mx-auto mb-2" />
//                                     <p className="text-sm">Invalid YouTube URL</p>
//                                     <p className="text-xs text-gray-400 mt-1">{item.url}</p>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
//                               <div className="text-center text-gray-500">
//                                 <AlertCircle className="w-8 h-8 mx-auto mb-2" />
//                                 <p className="text-sm">Unknown item type</p>
//                               </div>
//                             </div>
//                           )}

//                           {/* Item Name */}
//                           {item.name && (
//                             <div className="mt-3">
//                               <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
//                             </div>
//                           )}

//                           {item.type === 'video' && item.url && (
//                             <div className="mt-3">
//                               <a
//                                 href={item.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                               >
//                                 <LinkIcon className="w-4 h-4" />
//                                 Visit Link
//                               </a>
//                             </div>
//                           )}

//                           {/* Created Date */}
//                           <div className="mt-2 text-xs text-gray-500">
//                             Added: {new Date(item.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Categories Grid */}
//           {!viewingItems && (
//             <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//               {categories.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     {searchTerm ? 'No categories found' : 'No categories yet'}
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {searchTerm
//                       ? 'Try adjusting your search terms'
//                       : 'Get started by creating your first category'
//                     }
//                   </p>
//                   {!searchTerm && (
//                     <button
//                       onClick={handleCreateCategoryClick}
//                       className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Create Category
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
//                     {categories.map((category) => (
//                       <div
//                         key={category._id}
//                         className="bg-gray-50 rounded-lg shadow border border-gray-200 p-5 hover:shadow-lg transition min-h-[140px] flex flex-col"
//                       >
//                         {/* Category Header */}
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex-1 min-w-0">
//                             <h3
//                               className="font-semibold text-gray-900 text-base capitalize truncate"
//                               title={category.name}
//                             >
//                               {category.name}
//                             </h3>
//                             <p className="text-xs text-gray-500">
//                               Created: {new Date(category.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <button
//                               onClick={() => handleViewCategory(category)}
//                               className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                               title="View category details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* Items Count */}
//                         <div className="mb-4">
//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-600">Items:</span>
//                             <span className="font-semibold text-gray-900">
//                               {category.items?.length || 0}
//                             </span>
//                           </div>
//                           {category.items && category.items.length > 0 && (
//                             <div className="mt-1 text-xs text-gray-500">
//                               {category.items.filter(item => item.image).length} images,
//                               {' '}{category.items.filter(item => item.url).length} videos
//                             </div>
//                           )}
//                         </div>

//                         {/* View Items Button */}
//                         <div className="mt-auto">
//                           <button
//                             onClick={() => handleViewItems(category)}
//                             className="w-full flex items-center justify-center gap-2 border border-blue-500 text-blue-600 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 hover:text-white transition-colors font-medium text-sm"
//                           >
//                             <List className="w-4 h-4" />
//                             View Items
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {totalPages > 1 && (
//                     <div className="border-t border-gray-200 px-6 py-4">
//                       <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={handlePageChange}
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* Category Modal */}
//           <CategoryModal
//             isOpen={showCategoryModal}
//             onClose={handleModalClose}
//             onSubmit={handleCategorySubmit}
//             mode={modalMode}
//             category={modalCategory}
//             loading={submitting}
//             onEdit={handleEditFromModal}
//           />

//           {/* Item Modal */}
//           <ItemModal
//             isOpen={showItemModal}
//             onClose={handleModalClose}
//             onSubmit={(formData) => handleAddItem(modalCategory, formData)}
//             loading={submitting}
//             category={modalCategory}
//             error={error}
//           />

//           <DeleteConfirmationModal
//             isOpen={showDeleteModal}
//             onClose={() => setShowDeleteModal(false)}
//             onConfirm={confirmDelete}
//             title="Delete Item"
//             description="Are you sure you want to delete this item from this category? This action cannot be undone."
//             confirmButtonText="Delete"
//             cancelButtonText="Cancel"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default Categories;



import React, { useState, useEffect } from 'react';
import {
  Plus, Eye, Search, X, Loader, AlertCircle, FolderOpen, Edit,
  Image as ImageIcon, Link as LinkIcon, Trash2, List, Video
} from 'lucide-react';
import CategoryModal from './CategoryModal';
import ItemModal from './ItemModal';
import { Api } from "../../../Context/apiService";
import Pagination from '../../Common/Pagination';
import { useUser } from '../../../Context/ContextApt';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../Common/DeleteConfirmationModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [modalCategory, setModalCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingItems, setViewingItems] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Pagination state for categories
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Pagination state for items
  const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
  const [itemsPerPageCount] = useState(6); // Items per page for items view
  const [itemsTotalPages, setItemsTotalPages] = useState(1);
  const [itemsTotalResults, setItemsTotalResults] = useState(0);

  const { userId } = useParams();

  // Fetch categories
  const fetchCategories = async () => {
    if (!userId) {
      setError('User ID not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await Api.getCategories(userId, currentPage, itemsPerPage, searchTerm);
      const categoriesData = response.data;
      setCategories(categoriesData.categories || []);
      setTotalPages(categoriesData.pagination?.totalPages || 1);
      setTotalResults(categoriesData.pagination?.totalResults || categoriesData.categories?.length || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for a specific category with pagination
  const fetchCategoryItems = async (categoryId, page = 1) => {
    if (!userId || !categoryId) return;

    try {
      setItemsLoading(true);
      const response = await Api.getCategoryItems(userId, categoryId, page, itemsPerPageCount);

      setViewingItems(prev => ({
        ...prev,
        items: response.data.banners || [],
        pagination: response.data.pagination || {}
      }));

      // Update items pagination state
      setItemsTotalPages(response.data.pagination?.totalPages || 1);
      setItemsTotalResults(response.data.pagination?.totalResults || response.data.banners?.length || 0);
    } catch (err) {
      console.error('Failed to fetch category items:', err);
      setError('Failed to load items');
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [currentPage, searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchCategories();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);
  
  // Items pagination handler
  const handleItemsPageChange = (newPage) => {
    setItemsCurrentPage(newPage);
    if (viewingItems) {
      fetchCategoryItems(viewingItems._id, newPage);
    }
  };

  // Category CRUD
  const handleCreateCategory = async (formData) => {
    try {
      setSubmitting(true);
      await Api.createCategory(userId, formData);
      toast.success('Category created successfully!');
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      console.log(err)
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async (formData) => {
    try {
      setSubmitting(true);
      await Api.updateCategory(modalCategory._id, formData);
      toast.success('Category updated successfully!');
      setShowCategoryModal(false);
      setModalCategory(null);
      fetchCategories();
    } catch (err) {
      console.log(err)
      toast.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = (formData) => {
    if (modalMode === 'edit') handleEditCategory(formData);
    else handleCreateCategory(formData);
  };

  // Item CRUD
  const handleAddItem = async (category, formData) => {
    try {
      setSubmitting(true);
      await Api.addItemToCategory(userId, category._id, formData);
      toast.success('Item added successfully!');
      setShowItemModal(false);
      // Refresh the items for this category and reset to first page
      setItemsCurrentPage(1);
      await fetchCategoryItems(category._id, 1);
    } catch (err) {
      console.error('Error adding item:', err);
      toast.error('Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = (category, itemId) => {
    setSelectedCategory(category);
    setSelectedItem(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory?._id || !selectedItem) return;

    try {
      await Api.deleteItemFromCategory(userId, selectedCategory._id, selectedItem);
      toast.success('Item deleted successfully!');
      
      // Check if we need to go back to previous page after deletion
      const currentItems = viewingItems?.items || [];
      if (currentItems.length === 1 && itemsCurrentPage > 1) {
        // If this was the last item on the current page, go to previous page
        const newPage = itemsCurrentPage - 1;
        setItemsCurrentPage(newPage);
        await fetchCategoryItems(selectedCategory._id, newPage);
      } else {
        await fetchCategoryItems(selectedCategory._id, itemsCurrentPage);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Failed to delete item');
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Modal handlers
  const handleViewCategory = (category) => {
    setModalCategory(category);
    setModalMode('view');
    setShowCategoryModal(true);
  };

  const handleEditFromModal = () => setModalMode('edit');

  const handleCreateCategoryClick = () => {
    setShowCategoryModal(true);
    setModalCategory(null);
    setModalMode('create');
  };

  const handleViewItems = async (category) => {
    setViewingItems(category);
    setItemsCurrentPage(1); // Reset to first page when viewing items
    // Fetch items for this category
    await fetchCategoryItems(category._id, 1);
  };

  const handleAddItemClick = (category) => {
    setModalCategory(category);
    setShowItemModal(true);
  };

  const handleBackToCategories = () => {
    setViewingItems(null);
    setItemsCurrentPage(1); // Reset items pagination when going back
  };

  const handleModalClose = () => {
    setShowCategoryModal(false);
    setShowItemModal(false);
    setModalMode('view');
    setModalCategory(null);
  };

  const clearSearch = () => setSearchTerm('');

  // YouTube URL parsing function
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#&?]{11})/, // youtu.be/ABC123 or youtube.com/watch?v=ABC123
      /(?:youtube\.com\/embed\/)([^#&?]{11})/, // youtube.com/embed/ABC123
      /(?:youtube\.com\/v\/)([^#&?]{11})/, // youtube.com/v/ABC123
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {viewingItems ? `Items in ${viewingItems.name}` : 'Categories'}
              </h1>
              <p className="text-gray-600 mt-1">
                {viewingItems
                  ? `Showing ${viewingItems.items?.length || 0} of ${itemsTotalResults} items${itemsTotalPages > 1 ? ` • Page ${itemsCurrentPage} of ${itemsTotalPages}` : ''}`
                  : `Showing ${categories.length} of ${totalResults} categories${totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ''}`
                }
              </p>
            </div>

            {viewingItems ? (
              <div className="flex gap-3">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <List className="w-4 h-4" />
                  Back to Categories
                </button>
                <button
                  onClick={() => handleAddItemClick(viewingItems)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            ) : (
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
                {/* Add Category Button */}
                <button
                  onClick={handleCreateCategoryClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {message && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message}
            </div>
          )}

          {/* Items View */}
          {viewingItems && (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {itemsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (!viewingItems.items || viewingItems.items.length === 0) ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first item to this category
                  </p>
                  <button
                    onClick={() => handleAddItemClick(viewingItems)}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Item
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {viewingItems.items.map((item) => (
                        <div
                          key={item._id}
                          className="bg-gray-50 rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition"
                        >
                          {/* Item Header */}
                          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              {item.type === 'image' ? (
                                <>
                                  <ImageIcon className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-gray-700">Image</span>
                                </>
                              ) : item.type === 'video' ? (
                                <>
                                  <Video className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">Video</span>
                                </>
                              ) : null}
                            </div>
                            {/* <button
                              onClick={() => handleDeleteItem(viewingItems, item._id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button> */}
                          </div>

                          {/* Item Content */}
                          <div className="p-4">
                            {item.type === 'image' ? (
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.url}
                                  alt={item.name || 'Item image'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : item.type === 'video' ? (
                              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                {getYouTubeVideoId(item.url) ? (
                                  <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
                                    title={item.name || 'YouTube video'}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                      <Video className="w-8 h-8 mx-auto mb-2" />
                                      <p className="text-sm">Invalid YouTube URL</p>
                                      <p className="text-xs text-gray-400 mt-1">{item.url}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm">Unknown item type</p>
                                </div>
                              </div>
                            )}

                            {/* Item Name */}
                            {item.name && (
                              <div className="mt-3">
                                <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                              </div>
                            )}

                            {item.type === 'video' && item.url && (
                              <div className="mt-3">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                  Visit Link
                                </a>
                              </div>
                            )}

                            {/* Created Date */}
                            <div className="mt-2 text-xs text-gray-500">
                              Added: {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items Pagination */}
                  {itemsTotalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <Pagination
                        currentPage={itemsCurrentPage}
                        totalPages={itemsTotalPages}
                        onPageChange={handleItemsPageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Categories Grid */}
          {!viewingItems && (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No categories found' : 'No categories yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Get started by creating your first category'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleCreateCategoryClick}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Category
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="bg-gray-50 rounded-lg shadow border border-gray-200 p-5 hover:shadow-lg transition min-h-[140px] flex flex-col"
                      >
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-gray-900 text-base capitalize truncate"
                              title={category.name}
                            >
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(category.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewCategory(category)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View category details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Items Count */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-semibold text-gray-900">
                              {category.items?.length || 0}
                            </span>
                          </div>
                          {category.items && category.items.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500">
                              {category.items.filter(item => item.image).length} images,
                              {' '}{category.items.filter(item => item.url).length} videos
                            </div>
                          )}
                        </div>

                        {/* View Items Button */}
                        <div className="mt-auto">
                          <button
                            onClick={() => handleViewItems(category)}
                            className="w-full flex items-center justify-center gap-2 border border-blue-500 text-blue-600 py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 hover:text-white transition-colors font-medium text-sm"
                          >
                            <List className="w-4 h-4" />
                            View Items
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Category Modal */}
          <CategoryModal
            isOpen={showCategoryModal}
            onClose={handleModalClose}
            onSubmit={handleCategorySubmit}
            mode={modalMode}
            category={modalCategory}
            loading={submitting}
            onEdit={handleEditFromModal}
          />

          {/* Item Modal */}
          <ItemModal
            isOpen={showItemModal}
            onClose={handleModalClose}
            onSubmit={(formData) => handleAddItem(modalCategory, formData)}
            loading={submitting}
            category={modalCategory}
            error={error}
          />

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            title="Delete Item"
            description="Are you sure you want to delete this item from this category? This action cannot be undone."
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
          />
        </div>
      )}
    </>
  );
};

export default Categories;