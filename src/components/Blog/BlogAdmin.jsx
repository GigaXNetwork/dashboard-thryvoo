import React, { useMemo, useState } from 'react';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogCard } from './BlogCard';
import { CreateBlogForm } from './CreateBlogForm';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';
import { LoadingGrid } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { BookOpen, Users, Eye, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export const BlogAdmin = () => {
  const { blogs, loading, error, totalPages, currentPage, totalResults, refetch, changePage, deleteBlog } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) return blogs;

    return blogs.filter(blog =>
      blog.b_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.b_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.b_author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const stats = useMemo(() => {
    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
    const uniqueAuthors = new Set(blogs.map(blog => blog.b_author)).size;

    return {
      totalBlogs: totalResults,
      totalViews,
      uniqueAuthors,
    };
  }, [blogs, totalResults]);

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setSelectedBlog(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateSuccess = (result) => {
    setShowCreateForm(false);
    refetch(); // Refresh the blog list
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (blogId) => {
    setSelectedBlog(blogId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;
    setDeleteLoading(selectedBlog);
    
    try {
      await deleteBlog(selectedBlog);
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error("Failed to delete blog");
      console.error("Delete failed:", err.message);
    } finally {
      setDeleteLoading(null);
      setIsModalOpen(false);
      setSelectedBlog(null);
    }
  };

  // Show create form if requested
  if (showCreateForm) {
    return (
      <CreateBlogForm
        onBack={handleCreateCancel}
        onSuccess={handleCreateSuccess}
        blog={selectedBlog}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blog Administration
            </h1>
            <p className="text-gray-600">
              Manage and monitor your blog content
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create New Blog
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Authors</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.uniqueAuthors}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by title, description, or author..."
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                {searchTerm ? `${filteredBlogs.length} of ${blogs.length}` : `${blogs.length}`} blogs
              </span>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <LoadingGrid />
        ) : filteredBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deleteLoading={deleteLoading}
                />
              ))}
            </div>

            {/* Pagination - only show if not searching */}
            {!searchTerm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={changePage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No matching blogs found' : 'No blogs available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms or filters.'
                : 'There are no blogs to display at the moment.'
              }
            </p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {deleteLoading === selectedBlog ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-red-300 rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Yes'
                )}

              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;