// // components/Support/Support.jsx
// import React, { useState, useEffect } from 'react';
// import { Api } from '../../Context/apiService';
// import { Plus, Search, HelpCircle } from 'lucide-react';
// import { FaQuestionCircle } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import SupportForm from './SupportForm';
// import SupportCard from './SupportCard';
// import FAQForm from './FAQForm';
// import Pagination from '../common/Pagination';
// import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
// import { MdOutlineSupportAgent } from 'react-icons/md';

// const Support = () => {
//     const [helpItems, setHelpItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');

//     // Main modal states
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingItem, setEditingItem] = useState(null);

//     // FAQ modal states
//     const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
//     const [editingFAQ, setEditingFAQ] = useState(null);
//     const [currentCategory, setCurrentCategory] = useState(null);

//     // Delete modal states
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);
//     const [deleteType, setDeleteType] = useState(''); // 'category' or 'faq'
//     const [faqToDelete, setFaqToDelete] = useState(null);

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const [resultsCount, setResultsCount] = useState(0);

//     // Fetch help items with pagination
//     const fetchHelpItems = async (page = 1, search = '') => {
//         try {
//             setLoading(true);

//             const response = await Api.getHelpItems(page, 5, search);

//             if (response && response.data && Array.isArray(response.data.helpCategories)) {
//                 setHelpItems(response.data.helpCategories);
//                 setCurrentPage(response.currentPage || 1);
//                 setTotalPages(response.totalPages || 1);
//                 setTotalItems(response.total || 0);
//                 setResultsCount(response.results || response.data.helpCategories.length);
//             } else {
//                 setHelpItems([]);
//                 setTotalItems(0);
//                 setResultsCount(0);
//                 setTotalPages(1);
//             }
//         } catch (err) {
//             toast.error('Failed to fetch help items: ' + err.message);
//             console.error('Error fetching help items:', err);
//             setHelpItems([]);
//             setTotalPages(1);
//             setCurrentPage(1);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch data when component mounts or when page/search changes
//     useEffect(() => {
//         fetchHelpItems(currentPage, searchTerm);
//     }, [currentPage, searchTerm]);

//     useEffect(() => {
//         setSearchLoading(true);

//         const timeout = setTimeout(() => {
//           setSearchTerm(search);
//           setCurrentPage(1);
//           setSearchLoading(false);
//         }, 300);

//         return () => clearTimeout(timeout);
//       }, [search]);

//     // Reset to page 1 when search term changes
//     useEffect(() => {
//         if (searchTerm) {
//             setCurrentPage(1);
//         }
//     }, [searchTerm]);

//     // Handle Help Category operations
//     const handleSubmit = async (formData) => {
//         try {
//             setLoading(true);

//             if (editingItem) {
//                 await Api.updateHelpItem(editingItem._id, formData);
//                 toast.success('Help item updated successfully!');
//             } else {
//                 await Api.createHelpItem(formData);
//                 toast.success('Help item created successfully!');
//             }

//             setIsModalOpen(false);
//             setEditingItem(null);

//             if (editingItem) {
//                 fetchHelpItems(currentPage, searchTerm);
//             } else {
//                 setCurrentPage(1);
//             }
//         } catch (err) {
//             toast.error('Failed to save help item: ' + err.message);
//             console.error('Error saving help item:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (item) => {
//         setEditingItem(item);
//         setIsModalOpen(true);
//     };

//     const handleDelete = (id) => {
//         setItemToDelete(id);
//         setDeleteType('category');
//         setDeleteModalOpen(true);
//     };

//     const handleConfirmDelete = async () => {
//         try {
//             setLoading(true);

//             if (deleteType === 'category') {
//                 const response = await Api.deleteHelpItem(itemToDelete);
//                 console.log('Delete API response:', response);

//                 if (response && (response.status === 'success' || response.deleted)) {
//                     toast.success('Help item deleted successfully!');

//                     if (helpItems.length === 1 && currentPage > 1) {
//                         setCurrentPage(currentPage - 1);
//                     } else {
//                         fetchHelpItems(currentPage, searchTerm);
//                     }
//                 } else {
//                     throw new Error('Delete operation failed - no success response');
//                 }
//             } else if (deleteType === 'faq') {
//                 await Api.deleteFAQ(currentCategory, faqToDelete._id);
//                 toast.success('FAQ deleted successfully!');
//                 fetchHelpItems(currentPage, searchTerm);
//             }
//         } catch (err) {
//             console.error('Delete error details:', err);
//             const errorMessage = deleteType === 'category'
//                 ? 'Failed to delete help item: '
//                 : 'Failed to delete FAQ: ';
//             toast.error(errorMessage + (err.message || 'Unknown error'));
//         } finally {
//             setLoading(false);
//             setDeleteModalOpen(false);
//             setItemToDelete(null);
//             setFaqToDelete(null);
//             setCurrentCategory(null);
//         }
//     };

//     const handleCloseDeleteModal = () => {
//         setDeleteModalOpen(false);
//         setItemToDelete(null);
//         setFaqToDelete(null);
//         setCurrentCategory(null);
//     };

//     // Handle FAQ operations
//     const handleAddFAQ = (category) => {
//         setCurrentCategory(category._id);
//         setEditingFAQ(null);
//         setIsFAQModalOpen(true);
//     };

//     const handleEditFAQ = (category, faq) => {
//         setCurrentCategory(category._id);
//         setEditingFAQ(faq);
//         setIsFAQModalOpen(true);
//     };

//     const handleDeleteFAQ = (categoryId, faqId, faqQuestion) => {
//         setCurrentCategory(categoryId);
//         setFaqToDelete({ _id: faqId, question: faqQuestion });
//         setDeleteType('faq');
//         setDeleteModalOpen(true);
//     };

//     const handleFAQSubmit = async (faqData) => {
//         try {
//             setLoading(true);

//             if (editingFAQ) {
//                 await Api.updateFAQ(currentCategory, editingFAQ._id, faqData);
//                 toast.success('FAQ updated successfully!');
//             } else {
//                 await Api.addFAQ(currentCategory, faqData);
//                 toast.success('FAQ added successfully!');
//             }

//             setIsFAQModalOpen(false);
//             setEditingFAQ(null);
//             setCurrentCategory(null);
//             fetchHelpItems(currentPage, searchTerm);
//         } catch (err) {
//             toast.error('Failed to save FAQ: ' + err.message);
//             console.error('Error saving FAQ:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setEditingItem(null);
//         setIsModalOpen(false);
//     };

//     const resetFAQForm = () => {
//         setEditingFAQ(null);
//         setCurrentCategory(null);
//         setIsFAQModalOpen(false);
//     };

//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage);
//     };

//     const handleSearch = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     // Get delete modal content based on type
//     const getDeleteModalContent = () => {
//         if (deleteType === 'category') {
//             const category = helpItems.find(item => item._id === itemToDelete);
//             return {
//                 title: "Delete Help Category",
//                 description: `Are you sure you want to delete "${category?.help_cat_name}"? This will also delete all associated FAQs. This action cannot be undone.`
//             };
//         } else {
//             return {
//                 title: "Delete FAQ",
//                 description: `Are you sure you want to delete the FAQ: "${faqToDelete?.question}"? This action cannot be undone.`
//             };
//         }
//     };

//     const deleteModalContent = getDeleteModalContent();

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">

//                 <div className="mb-8">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <div>
//                             <div className="flex items-center gap-3 mb-2">
//                                 <MdOutlineSupportAgent className="text-3xl text-blue-600" />
//                                 <h1 className="text-3xl font-bold text-gray-900">Support Management</h1>
//                             </div>
//                             <p className="text-gray-600">Manage help categories and support items</p>
//                         </div>

//                         <div className="flex justify-end items-center gap-4 w-full sm:w-auto">
//                             <div className="relative flex-1 max-w-md">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search help items..."
//                                     value={searchTerm}
//                                     onChange={handleSearch}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>
//                             <button
//                                 onClick={() => setIsModalOpen(true)}
//                                 disabled={loading}
//                                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             >
//                                 <Plus className="w-5 h-5" />
//                                 Add Help Item
//                             </button>
//                         </div>
//                     </div>
//                 </div>


//                 {/* Results Count */}
//                 <div className="mb-4 text-sm text-gray-600">
//                     Showing {resultsCount} of {totalItems} help categories
//                     {searchTerm && ' (filtered)'}
//                     {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     </div>
//                 )}

//                 {/* Help Items Grid */}
//                 {!loading && helpItems.length > 0 && (
//                     <>
//                         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                             {helpItems.map((item) => (
//                                 <SupportCard
//                                     key={item._id}
//                                     item={item}
//                                     onEdit={handleEdit}
//                                     onDelete={handleDelete}
//                                     onAddFAQ={handleAddFAQ}
//                                     onEditFAQ={handleEditFAQ}
//                                     onDeleteFAQ={handleDeleteFAQ}
//                                     loading={loading}
//                                 />
//                             ))}
//                         </div> */}

//                         <div className="space-y-6 mb-8">
//                             {helpItems.map((item) => (
//                                 <SupportCard
//                                     key={item._id}
//                                     item={item}
//                                     onEdit={handleEdit}
//                                     onDelete={handleDelete}
//                                     onAddFAQ={handleAddFAQ}
//                                     onEditFAQ={handleEditFAQ}
//                                     onDeleteFAQ={handleDeleteFAQ}
//                                     loading={loading}
//                                 />
//                             ))}
//                         </div>

//                         {/* Pagination */}
//                         {totalPages > 1 && (
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={handlePageChange}
//                             />
//                         )}
//                     </>
//                 )}

//                 {/* Empty State */}
//                 {!loading && helpItems.length === 0 && !searchTerm && (
//                     <div className="text-center py-12">
//                         <FaQuestionCircle className="mx-auto text-6xl text-gray-300 mb-4" />
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">No help categories found</h3>
//                         <p className="text-gray-600 mb-6">Get started by creating your first help category.</p>
//                         <button
//                             onClick={() => setIsModalOpen(true)}
//                             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             Create Help Category
//                         </button>
//                     </div>
//                 )}

//                 {/* No Search Results */}
//                 {!loading && helpItems.length === 0 && searchTerm && (
//                     <div className="text-center py-12">
//                         <Search className="mx-auto w-12 h-12 text-gray-300 mb-4" />
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
//                         <p className="text-gray-600">Try adjusting your search terms.</p>
//                     </div>
//                 )}
//             </div>

//             {/* Help Category Form Modal */}
//             <SupportForm
//                 isOpen={isModalOpen}
//                 onClose={resetForm}
//                 onSubmit={handleSubmit}
//                 loading={loading}
//                 editingItem={editingItem}
//             />

//             {/* FAQ Form Modal */}
//             <FAQForm
//                 isOpen={isFAQModalOpen}
//                 onClose={resetFAQForm}
//                 onSubmit={handleFAQSubmit}
//                 loading={loading}
//                 editingFAQ={editingFAQ}
//                 categoryId={currentCategory}
//             />

//             {/* Delete Confirmation Modal */}
//             <DeleteConfirmationModal
//                 isOpen={deleteModalOpen}
//                 onClose={handleCloseDeleteModal}
//                 onConfirm={handleConfirmDelete}
//                 title={deleteModalContent.title}
//                 description={deleteModalContent.description}
//                 confirmButtonText="Delete"
//                 cancelButtonText="Cancel"
//                 isLoading={loading}
//             />
//         </div>
//     );
// };

// export default Support;




// components/Support/Support.jsx
import React, { useState, useEffect } from 'react';
import { Api } from '../../Context/apiService';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SupportForm from './SupportForm';
import SupportCard from './SupportCard';
import FAQForm from './FAQForm';
import Pagination from '../common/Pagination';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { MdOutlineSupportAgent } from 'react-icons/md';

const Support = () => {
    const [helpItems, setHelpItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(''); // Immediate search input value
    const [searchTerm, setSearchTerm] = useState(''); // Debounced search term for API
    const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading

    // Main modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // FAQ modal states
    const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Delete modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'category' or 'faq'
    const [faqToDelete, setFaqToDelete] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [resultsCount, setResultsCount] = useState(0);

    // Debounced search effect
    useEffect(() => {
        setSearchLoading(true);

        const timeout = setTimeout(() => {
            setSearchTerm(search);
            setCurrentPage(1);
            setSearchLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    // Fetch help items with pagination
    const fetchHelpItems = async (page = 1, search = '') => {
        try {
            setLoading(true);

            const response = await Api.getHelpItems(page, 5, search);

            if (response && response.data && Array.isArray(response.data.helpCategories)) {
                setHelpItems(response.data.helpCategories);
                setCurrentPage(response.currentPage || 1);
                setTotalPages(response.totalPages || 1);
                setTotalItems(response.total || 0);
                setResultsCount(response.results || response.data.helpCategories.length);
            } else {
                setHelpItems([]);
                setTotalItems(0);
                setResultsCount(0);
                setTotalPages(1);
            }
        } catch (err) {
            toast.error('Failed to fetch help items: ' + err.message);
            console.error('Error fetching help items:', err);
            setHelpItems([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or when page/searchTerm changes
    useEffect(() => {
        fetchHelpItems(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    // Handle Help Category operations
    const handleSubmit = async (formData) => {
        try {
            setLoading(true);

            if (editingItem) {
                await Api.updateHelpItem(editingItem._id, formData);
                toast.success('Help item updated successfully!');
            } else {
                await Api.createHelpItem(formData);
                toast.success('Help item created successfully!');
            }

            setIsModalOpen(false);
            setEditingItem(null);

            if (editingItem) {
                fetchHelpItems(currentPage, searchTerm);
            } else {
                setCurrentPage(1);
            }
        } catch (err) {
            toast.error('Failed to save help item: ' + err.message);
            console.error('Error saving help item:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setDeleteType('category');
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);

            if (deleteType === 'category') {
                const response = await Api.deleteHelpItem(itemToDelete);
                console.log('Delete API response:', response);

                if (response && (response.status === 'success' || response.deleted)) {
                    toast.success('Help item deleted successfully!');

                    if (helpItems.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        fetchHelpItems(currentPage, searchTerm);
                    }
                } else {
                    throw new Error('Delete operation failed - no success response');
                }
            } else if (deleteType === 'faq') {
                await Api.deleteFAQ(currentCategory, faqToDelete._id);
                toast.success('FAQ deleted successfully!');
                fetchHelpItems(currentPage, searchTerm);
            }
        } catch (err) {
            console.error('Delete error details:', err);
            const errorMessage = deleteType === 'category'
                ? 'Failed to delete help item: '
                : 'Failed to delete FAQ: ';
            toast.error(errorMessage + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            setFaqToDelete(null);
            setCurrentCategory(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
        setFaqToDelete(null);
        setCurrentCategory(null);
    };

    // Handle FAQ operations
    const handleAddFAQ = (category) => {
        setCurrentCategory(category._id);
        setEditingFAQ(null);
        setIsFAQModalOpen(true);
    };

    const handleEditFAQ = (category, faq) => {
        setCurrentCategory(category._id);
        setEditingFAQ(faq);
        setIsFAQModalOpen(true);
    };

    const handleDeleteFAQ = (categoryId, faqId, faqQuestion) => {
        setCurrentCategory(categoryId);
        setFaqToDelete({ _id: faqId, question: faqQuestion });
        setDeleteType('faq');
        setDeleteModalOpen(true);
    };

    const handleFAQSubmit = async (faqData) => {
        try {
            setLoading(true);

            if (editingFAQ) {
                await Api.updateFAQ(currentCategory, editingFAQ._id, faqData);
                toast.success('FAQ updated successfully!');
            } else {
                await Api.addFAQ(currentCategory, faqData);
                toast.success('FAQ added successfully!');
            }

            setIsFAQModalOpen(false);
            setEditingFAQ(null);
            setCurrentCategory(null);
            fetchHelpItems(currentPage, searchTerm);
        } catch (err) {
            toast.error('Failed to save FAQ: ' + err.message);
            console.error('Error saving FAQ:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const resetFAQForm = () => {
        setEditingFAQ(null);
        setCurrentCategory(null);
        setIsFAQModalOpen(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // Get delete modal content based on type
    const getDeleteModalContent = () => {
        if (deleteType === 'category') {
            const category = helpItems.find(item => item._id === itemToDelete);
            return {
                title: "Delete Help Category",
                description: `Are you sure you want to delete "${category?.help_cat_name}"? This will also delete all associated FAQs. This action cannot be undone.`
            };
        } else {
            return {
                title: "Delete FAQ",
                description: `Are you sure you want to delete the FAQ: "${faqToDelete?.question}"? This action cannot be undone.`
            };
        }
    };

    const deleteModalContent = getDeleteModalContent();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}

                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <MdOutlineSupportAgent className="text-3xl text-blue-600" />
                                <h1 className="text-3xl font-bold text-gray-900">Support Management</h1>
                            </div>
                            <p className="text-gray-600">Manage help categories and support items</p>
                        </div>

                        <div className="flex justify-end items-center gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search help items..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={loading}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                                Add Help Item
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                    Showing {resultsCount} of {totalItems} help categories
                    {searchTerm && ' (filtered)'}
                    {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
                    {searchLoading && ' - Searching...'}
                </div>

                {/* Loading State */}
                {(loading || searchLoading) && !helpItems.length && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Help Items List */}
                {!loading && !searchLoading && helpItems.length > 0 && (
                    <>
                        <div className="space-y-6 mb-8">
                            {helpItems.map((item) => (
                                <SupportCard
                                    key={item._id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onAddFAQ={handleAddFAQ}
                                    onEditFAQ={handleEditFAQ}
                                    onDeleteFAQ={handleDeleteFAQ}
                                    loading={loading}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && !searchLoading && helpItems.length === 0 && !searchTerm && (
                    <div className="text-center py-12">
                        <FaQuestionCircle className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No help categories found</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first help category.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Help Category
                        </button>
                    </div>
                )}

                {/* No Search Results */}
                {!loading && !searchLoading && helpItems.length === 0 && searchTerm && (
                    <div className="text-center py-12">
                        <Search className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            {/* Help Category Form Modal */}
            <SupportForm
                isOpen={isModalOpen}
                onClose={resetForm}
                onSubmit={handleSubmit}
                loading={loading}
                editingItem={editingItem}
            />

            {/* FAQ Form Modal */}
            <FAQForm
                isOpen={isFAQModalOpen}
                onClose={resetFAQForm}
                onSubmit={handleFAQSubmit}
                loading={loading}
                editingFAQ={editingFAQ}
                categoryId={currentCategory}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title={deleteModalContent.title}
                description={deleteModalContent.description}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                isLoading={loading}
            />
        </div>
    );
};

export default Support;