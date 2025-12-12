import React, { useState } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  X,
  Loader,
  CheckCircle
} from 'lucide-react';

const ExcelUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  templateUrl = '/templates/sample.xlsx',
  templateFileName = 'sample.xlsx',
  uploadLoading = false,
  allowedFileTypes = ['.xlsx', '.csv'],
  maxFileSize = 10 * 1024 * 1024,
  instructions = []
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // Default instructions
  const defaultInstructions = [
    'Required columns: Name, Email, Phone',
    'File will be processed immediately after upload'
  ];

  const finalInstructions = instructions.length > 0 ? instructions : defaultInstructions;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setError('');

    const isValidType = allowedFileTypes.some(type =>
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );

    if (!isValidType) {
      setError(`Please upload a valid file (${allowedFileTypes.join(', ')})`);
      return;
    }

    if (file.size > maxFileSize) {
      setError(`File size should be less than ${formatFileSize(maxFileSize)}`);
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Download template from frontend assets
  const downloadTemplate = () => {
    try {
      const link = document.createElement('a');
      link.href = templateUrl;
      link.download = templateFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download template. Please try again.');
      console.error('Error downloading template:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploadProgress(10);
      await onUpload(selectedFile, setUploadProgress);
      setUploadProgress(100);

      setTimeout(() => {
        resetModal();
      }, 1500);
    } catch (err) {
      setUploadProgress(0);
      setError(err.message || 'Failed to upload file');
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setError('');
    setUploadProgress(0);
    setIsDragOver(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mt-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Upload Excel File</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploadLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <X className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto p-1 hover:bg-red-100 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {uploadProgress === 100 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">File uploaded successfully!</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${isDragOver
              ? 'border-blue-400 bg-blue-50'
              : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50'
              } ${uploadLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                {uploadProgress === 100 ? (
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                ) : (
                  <FileText className="w-12 h-12 text-green-500 mx-auto" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                {!uploadLoading && uploadProgress !== 100 && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove File
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium text-gray-900 mb-">Drop your Excel file here</p>
                  <p className="text-sm text-gray-500">or</p>
                </div>
                <label className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                  <Upload className="w-4 h-4" />
                  Browse Files
                  <input
                    type="file"
                    accept={allowedFileTypes.join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supports {allowedFileTypes.join(', ')} • Max {formatFileSize(maxFileSize)}
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadLoading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium text-gray-900">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload Instructions
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {finalInstructions.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-blue-700">
                Ensure data follows the correct format in{' '}
                <button
                  onClick={downloadTemplate}
                  className="text-blue-800 hover:text-blue-900 font-medium underline underline-offset-2 transition-colors"
                >
                  Sample template.xlsx
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={uploadLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadLoading || uploadProgress === 100}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploadLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploadProgress === 100 ? 'Uploaded!' : uploadLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;