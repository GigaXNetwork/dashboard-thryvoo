import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://api.thryvoo.com/api/blog';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}?page=${page}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success' && data.data?.blogs) {
        setBlogs(data.data.blogs);
        setTotalPages(data.pages);
        setCurrentPage(data.currentPage);
        setTotalResults(data.total);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const refetch = () => fetchBlogs(currentPage);
  const changePage = (page) => fetchBlogs(page);

  const deleteBlog = async (blogId) => {
    try {
      let token = Cookies.get('authToken');
      if (!token) throw new Error('No auth token found');
      token = token.replace(/^Bearer\s+/i, '');

      const response = await fetch(`${API_BASE_URL}/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog: ${response.status}`);
      }

      // Refresh the current page after successful deletion
      await fetchBlogs(currentPage);
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete blog');
    }
  };

  return {
    blogs,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    refetch,
    changePage,
    deleteBlog,
  };
};