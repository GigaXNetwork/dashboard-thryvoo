import React, { useState, useEffect } from 'react';
import {
  Plus, Eye, Search, X, Loader, AlertCircle, FolderOpen, Edit
} from 'lucide-react';
import CategoryModal from './CategoryModal';
import { Api } from "../../../Context/apiService";
import Pagination from '../../Common/Pagination';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [modalCategory, setModalCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await Api.getCategories(currentPage, itemsPerPage, searchTerm);
      const categoriesData = response.data;
      setCategories(categoriesData.categories || []);
      setTotalPages(categoriesData.pagination.totalPages || 1);
      setTotalResults(response.results || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
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

  // Create
  const handleCreateCategory = async (formData) => {
    try {
      setSubmitting(true);
      await Api.createCategory({ name: formData.name.trim() });
      setMessage('✅ Category created successfully!');
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const handleEditCategory = async (formData) => {
    try {
      setSubmitting(true);
      await Api.updateCategory(modalCategory._id, { name: formData.name.trim() });
      setMessage('✅ Category updated successfully!');
      setShowModal(false);
      setModalCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') handleEditCategory(formData);
    else handleCreateCategory(formData);
  };

  // Open modal logic
  const handleViewClick = (category) => {
    setModalCategory(category);
    setModalMode('view');
    setShowModal(true);
  };
  const handleEditFromModal = () => setModalMode('edit');
  const handleCreateClick = () => {
    setShowModal(true);
    setModalCategory(null); // not in view/edit mode
    setModalMode('create');
  };
  const handleModalClose = () => {
    setShowModal(false);
    setModalMode('view');
    setModalCategory(null);
  };
  const clearSearch = () => setSearchTerm('');
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
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">
                Showing {categories.length} of {totalResults} categories
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
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
                onClick={handleCreateClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
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
          {/* Categories Grid */}
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
                    onClick={handleCreateClick}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Category
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-gray-50 rounded-lg shadow border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-lg transition min-h-[100px]"
                    >
                      <div
                        className="text-lg font-semibold text-gray-900 capitalize truncate w-full"
                        title={category.name}
                      >
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-500">Created: {new Date(category.createdAt).toLocaleDateString()}</div>
                      <button
                        onClick={() => handleViewClick(category)}
                        className="mt-2 text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 self-start"
                        title="View category"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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
          {/* Category Modal (view/edit in one) */}
          <CategoryModal
            isOpen={showModal}
            onClose={handleModalClose}
            onSubmit={handleSubmit}
            mode={modalMode} // "view", "edit", or "create"
            category={modalCategory}
            loading={submitting}
            onEdit={handleEditFromModal} // trigger edit mode in modal
          />
        </div>
      )}
    </>
  );
};

export default Categories;
