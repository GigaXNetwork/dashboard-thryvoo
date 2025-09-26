import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};