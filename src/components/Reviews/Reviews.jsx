import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router';

function Reviews({ role }) {
  const { userId } = useParams(); // ✅ moved to top-level
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (search.trim()) params.search = search.trim();
        if (ratingFilter) params.rating = ratingFilter;

        let apiUrl;

        if (role === 'admin') {
          apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/reviews`;
          if (userId) {
            params.user = userId;
          }
        } else {
          apiUrl = `${import.meta.env.VITE_API_URL}/api/user/myreviews`;
        }

        const res = await axios.get(apiUrl, {
          params,
          withCredentials: true,
        });

        setReviews(res.data.data.reviews || []);
        setTotalPages(Math.ceil(res.data.results / itemsPerPage));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchReviews, 300);
    return () => clearTimeout(timeout);
  }, [search, ratingFilter, currentPage, role, userId]); // make sure to include dependencies

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > delta + 2) range.push('...');
      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }
      if (currentPage < totalPages - (delta + 1)) range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Customer Reviews</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {['Name', 'Phone', 'Email', 'Rating', 'Review', 'Date'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{review.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{review.phone}</td>
                      <td className="px-6 py-4 max-w-xs break-words text-gray-700">{review.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-yellow-500 font-semibold">{review.rating} ★</td>
                      <td className="px-6 py-4 max-w-xs break-words text-gray-800">{review.review}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2 items-center flex-wrap gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {getPaginationRange().map((page, idx) =>
              page === '...' ? (
                <span key={idx} className="px-3 py-1 text-gray-500 select-none">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1 rounded-md border text-sm shadow min-w-[36px] ${page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-300'
                    }`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Reviews;
