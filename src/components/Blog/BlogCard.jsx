import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export const BlogCard = ({ blog, onEdit, onDelete, deleteLoading }) => {
  const isDeleting = deleteLoading === blog.id;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
            {blog.b_title}
          </h3>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {blog.b_category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {blog.b_description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              By {blog.b_author}
            </span>
            <span className="flex items-center gap-1">
              {blog.read_time_formatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(blog)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit blog"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(blog.id)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete blog"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};