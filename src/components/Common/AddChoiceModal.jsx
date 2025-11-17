// components/Common/AddChoiceModal.jsx
import React from 'react';
import { X, FolderOpen, PlusCircle } from 'lucide-react';

const AddChoiceModal = ({ 
  isOpen, 
  onClose, 
  onSelectPreset, 
  onCreateCustom,
  title = "Add Item",
  description = "Choose how you want to add an item"
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md mx-4">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white p-6 border-b flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </header>

          {/* Options */}
          <div className="p-6 space-y-4">
            <button
              onClick={onSelectPreset}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 text-lg">Select from Presets</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Choose from your existing coupon presets
                </p>
              </div>
            </button>

            <button
              onClick={onCreateCustom}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <PlusCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 text-lg">Create Custom Preset</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Create a new custom coupon preset
                </p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <footer className="border-t p-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AddChoiceModal;