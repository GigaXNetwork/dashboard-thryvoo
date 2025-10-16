import React, { useState, useEffect } from 'react';
import { X, Edit, Loader2 } from "lucide-react";

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  category,
  loading,
  onEdit
}) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (mode === 'edit' && category) setInput(category.name);
    else if (mode === 'create') setInput('');
  }, [mode, category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Modal header & close */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {mode === 'view' && 'Category Details'}
            {mode === 'edit' && 'Edit Category'}
            {mode === 'create' && 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* View Mode */}
        {mode === 'view' && category && (
          <div className="space-y-6">
            <div>
              {/* <div className="text-gray-600 text-sm font-medium mb-1">Category Name</div> */}
              <div
                className="border rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900 font-semibold break-words w-full"
                style={{ wordBreak: "break-word" }}
              >
                {category.name}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={onEdit}
                className=" text-blue-600 rounded-lg px-4 py-2 hover:bg-gray-200 font-semibold"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit/Create Mode */}
        {(mode === 'edit' || mode === 'create') && (
          <form
            className="space-y-6"
            onSubmit={e => { e.preventDefault(); onSubmit({ name: input }); }}
          >
            <div className="text-gray-600 text-sm font-medium mb-1">Category Name *</div>
            <input
              className="w-full border rounded-lg px-4 py-2.5 mb-2"
              placeholder="Enter category name"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              disabled={loading}
              autoFocus
              type="text"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold"
                disabled={loading}
              >Cancel</button>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 font-semibold"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <>
                    <span className="flex items-center gap-2">
                      <Loader2 className='animate-spin' size={16} />
                      {mode === 'edit' ? 'Saving...' : 'Creating...'}
                    </span>
                  </>
                ) : (
                  mode === 'edit' ? 'Save' : 'Create'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;
