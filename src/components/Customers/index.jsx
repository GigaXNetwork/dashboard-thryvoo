// import React, { useState, useEffect, useCallback } from 'react';
// import { Api } from '../../Context/apiService';
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Loader,
//   AlertCircle,
//   X,
//   Search,
//   Upload,
//   MessageCircle,
//   Loader2
// } from 'lucide-react';
// import LeadFormModal from './LeadFormModal';
// import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";
// import Pagination from '../Common/Pagination';
// import ExcelUploadModal from './ExcelUploadModal';
// import WhatsAppCampaignModal from './WhatsAppCampaignModal';
// import userLogo from '../../assets/images/default-user.png';
// import { toast } from 'react-toastify';

// const Customers = () => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showExcelModal, setShowExcelModal] = useState(false);
//   const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
//   const [editingLead, setEditingLead] = useState(null);
//   const [deletingLead, setDeletingLead] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [messageLoading, setMessageLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [hasPreviousPage, setHasPreviousPage] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [debounceTimer, setDebounceTimer] = useState(null);
//   const [tableRefreshLoading, setTableRefreshLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });

//   useEffect(() => {
//     const isSearch = searchTerm.trim() !== '';
//     fetchLeads(isSearch);
//   }, [currentPage, searchTerm]);

//   useEffect(() => {
//     return () => {
//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }
//     };
//   }, [debounceTimer]);

//   // Debounced search function
//   const debouncedSearch = useCallback((term) => {
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     const timer = setTimeout(() => {
//       setSearchTerm(term);
//       setCurrentPage(1);
//     }, 500);

//     setDebounceTimer(timer);
//   }, [debounceTimer]);

//   const fetchLeads = async (isSearch = false) => {
//     try {
//       if (isSearch) {
//         setSearchLoading(true);
//       } else {
//         setLoading(true);
//       }

//       setError('');

//       const response = await Api.getLeads(currentPage, itemsPerPage, searchTerm);
//       const leadsData = response.data;

//       setLeads(leadsData.leads || []);
//       setTotalPages(leadsData.totalPages || 1);
//       setItemsPerPage(leadsData.itemsPerPage || 10);
//       setHasNextPage(leadsData.hasNextPage || false);
//       setHasPreviousPage(leadsData.hasPreviousPage || false);
//       setTotalResults(response.results || 0);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch leads. Please try again.');
//       console.error('Error fetching leads:', err);
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//     }
//   };

//   // Excel Upload Handler
//   const handleExcelUpload = async (file, setProgress) => {
//     try {
//       setUploadLoading(true);
//       setError('');

//       const formData = new FormData();
//       formData.append('excelFile', file);

//       if (setProgress) setProgress(30);

//       const response = await Api.importCustomersExcel(formData);

//       if (response.status === "success") {
//         if (setProgress) setProgress(100);

//         toast.success(response?.message || 'Excel file uploaded successfully!');
//         setShowExcelModal(false);
//         await fetchLeads();
//       } else {
//         const errorMessage = response.data?.message || 'Upload failed';
//         throw new Error(errorMessage);
//       }

//     } catch (err) {
//       if (setProgress) setProgress(0);
//       throw new Error(err.message || 'Failed to upload Excel file. Please try again.');
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // WhatsApp Message Handler
//   const handleSendWhatsAppMessage = async (messageData) => {
//     try {
//       setMessageLoading(true);

//       const response = await Api.sendWhatsAppMessage(messageData);

//       setError(`✅ WhatsApp message sent to ${messageData.lead.name}!`);

//       setShowWhatsAppModal(false);
//       setSelectedLead(null);

//     } catch (err) {
//       setError(err.message || 'Failed to send WhatsApp message');
//       throw err;
//     } finally {
//       setMessageLoading(false);
//     }
//   };

//   const handleSearchInputChange = (e) => {
//     const value = e.target.value;
//     debouncedSearch(value);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setCurrentPage(1);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({ name: '', email: '', phone: '' });
//     setEditingLead(null);
//     setShowForm(false);
//     setSubmitting(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       if (editingLead) {
//         await Api.updateLead(editingLead._id, formData);
//       } else {
//         await Api.createLead(formData);
//       }

//       resetForm();
//       setCurrentPage(1);
//       fetchLeads();
//     } catch (err) {
//       setError(err.message || `Failed to ${editingLead ? 'update' : 'create'} lead. Please try again.`);
//       console.error('Error saving lead:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (lead) => {
//     setEditingLead(lead);
//     setFormData({
//       name: lead.name,
//       email: lead.email,
//       phone: lead.phone
//     });
//     setShowForm(true);
//   };

//   const handleDeleteClick = (lead) => {
//     setDeletingLead(lead);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!deletingLead) return;

//     try {
//       setDeleteLoading(true);
//       await Api.deleteLead(deletingLead._id);

//       setShowDeleteModal(false);
//       setDeletingLead(null);
//       setDeleteLoading(false);

//       setTableRefreshLoading(true);
//       await fetchLeads();

//     } catch (error) {
//       setError(error.message || 'Failed to delete lead. Please try again.');
//       console.error('Error deleting lead:', error);
//     } finally {
//       setTableRefreshLoading(false);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false);
//     setDeletingLead(null);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-64 gap-2">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600 mt-1">
//             Showing {leads.length} of {totalResults} customer{totalResults !== 1 ? 's' : ''}
//             {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
//             {searchTerm && ` • Searching for "${searchTerm}"`}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex justify-between items-center">
//             {/* Search Info */}
//             <div className="flex-1 mr-2">
//               {searchTerm && (
//                 <p className="text-sm text-gray-600">
//                   <button
//                     onClick={clearSearch}
//                     className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Clear search
//                   </button>
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   onChange={handleSearchInputChange}
//                   className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//                 {searchLoading && (
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                     <Loader className="w-4 h-4 animate-spin text-blue-600" />
//                   </div>
//                 )}
//               </div>

//               {/* Excel Upload Modal Trigger */}
//               <button
//                 onClick={() => setShowExcelModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
//               >
//                 <Upload className="w-4 h-4" />
//                 Import
//               </button>

//               {/* Add Button */}
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
//           error.includes('✅') 
//             ? 'bg-green-50 border border-green-200 text-green-700'
//             : 'bg-red-50 border border-red-200 text-red-700'
//         }`}>
//           {error.includes('✅') ? (
//             <MessageCircle className="w-5 h-5" />
//           ) : (
//             <AlertCircle className="w-5 h-5" />
//           )}
//           {error}
//           <button onClick={() => setError('')} className="ml-auto">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Lead Form Modal */}
//       <LeadFormModal
//         show={showForm}
//         onClose={resetForm}
//         onSubmit={handleSubmit}
//         formData={formData}
//         onInputChange={handleInputChange}
//         editingLead={editingLead}
//         submitting={submitting}
//       />

//       {/* Excel Upload Modal */}
//       <ExcelUploadModal
//         isOpen={showExcelModal}
//         onClose={() => setShowExcelModal(false)}
//         onUpload={handleExcelUpload}
//         templateUrl="/templates/sample.xlsx"
//         templateFileName="leads_template.xlsx"
//         uploadLoading={uploadLoading}
//         allowedFileTypes={['.xlsx']}
//         maxFileSize={10 * 1024 * 1024}
//         instructions={[
//           'Required columns: Name, Email, Phone',
//           'Ensure data follows the correct format in sample template',
//           'Remove any empty rows before uploading',
//           'File will be processed immediately after upload'
//         ]}
//       />

//       {/* WhatsApp Campaign Modal */}
//       <WhatsAppCampaignModal
//         isOpen={showWhatsAppModal}
//         onClose={() => {
//           setShowWhatsAppModal(false);
//           setSelectedLead(null);
//         }}
//         selectedLead={selectedLead}
//         onSendMessage={handleSendWhatsAppMessage}
//         isLoading={messageLoading}
//       />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setDeletingLead(null);
//         }}
//         onConfirm={handleDeleteConfirm}
//         description={
//           <p>
//             Are you sure you want to delete the lead <strong>"{deletingLead?.name}"</strong>?
//             This action cannot be undone.
//           </p>
//         }
//         isLoading={deleteLoading}
//       />

//       {/* Leads Table */}
//       <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//         {tableRefreshLoading ? (
//           <div className="flex items-center justify-center py-16">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             <p className="ml-3 text-gray-600">Refreshing data...</p>
//           </div>
//         ) : leads.length === 0 ? (
//             <div className="text-center py-12">
//               <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg">
//                 {searchTerm ? 'No leads found matching your search' : 'No leads found'}
//               </p>
//               {searchTerm ? (
//                 <button
//                   onClick={clearSearch}
//                   className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Clear search
//                 </button>
//               ) : (
//                 <div className="mt-4 space-x-4">
//                   <button
//                     onClick={() => setShowForm(true)}
//                     className="text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Create your first lead
//                   </button>
//                   <span className="text-gray-400">or</span>
//                   <button
//                     onClick={() => setShowExcelModal(true)}
//                     className="text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Upload Excel file
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Phone
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {leads.map((lead, index) => (
//                       <tr key={lead._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">
//                           <div className="flex items-center space-x-3">
//                             <div className="flex-shrink-0">
//                               <img
//                                 src={lead.photo || userLogo}
//                                 alt={lead.name}
//                                 className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
//                               />
//                             </div>
//                             <div className="flex flex-col space-y-1">
//                               <div className="flex items-center space-x-2">
//                                 <span className="font-normal text-gray-900 capitalize">{lead.name}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-600">{lead.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-600">{lead.phone || '-'}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-600">
//                             {formatDate(lead.createdAt)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center gap-3">
//                             {/* WhatsApp Button */}
//                             {lead.phone && (
//                               <button
//                                 onClick={() => {
//                                   setSelectedLead(lead);
//                                   setShowWhatsAppModal(true);
//                                 }}
//                                 className="text-green-600 hover:text-green-900 transition-colors"
//                                 title="Send WhatsApp message"
//                               >
//                                 <MessageCircle className="w-4 h-4" />
//                               </button>
//                             )}

//                             <button
//                               onClick={() => handleEdit(lead)}
//                               className="text-blue-600 hover:text-blue-900 transition-colors"
//                               title="Edit lead"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteClick(lead)}
//                               className="text-red-600 hover:text-red-900 transition-colors"
//                               title="Delete lead"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="border-t border-gray-200 px-6 py-4">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               )}
//             </>
//           )}
//       </div>
//     </div>
//   );
// };

// export default Customers;



import React, { useState, useEffect, useCallback } from 'react';
import { Api } from '../../Context/apiService';
import {
  Plus,
  Edit,
  Trash2,
  Loader,
  AlertCircle,
  X,
  Search,
  Upload,
  Download,
  MessageCircle,
  Loader2,
  ChevronDown,
  Sheet
} from 'lucide-react';
import LeadFormModal from './LeadFormModal';
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";
import Pagination from '../Common/Pagination';
import ExcelUploadModal from './ExcelUploadModal';
import WhatsAppCampaignModal from './WhatsAppCampaignModal';
import userLogo from '../../assets/images/default-user.png';
import { toast } from 'react-toastify';

const Customers = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExcelDropdown, setShowExcelDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [tableRefreshLoading, setTableRefreshLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const isSearch = searchTerm.trim() !== '';
    fetchLeads(isSearch);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Debounced search function
  const debouncedSearch = useCallback((term) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 500);

    setDebounceTimer(timer);
  }, [debounceTimer]);

  const fetchLeads = async (isSearch = false) => {
    try {
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await Api.getLeads(currentPage, itemsPerPage, searchTerm);
      const leadsData = response.data;

      setLeads(leadsData.leads || []);
      setTotalPages(leadsData.totalPages || 1);
      setItemsPerPage(leadsData.itemsPerPage || 10);
      setHasNextPage(leadsData.hasNextPage || false);
      setHasPreviousPage(leadsData.hasPreviousPage || false);
      setTotalResults(response.results || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads. Please try again.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Excel Upload Handler
  const handleExcelUpload = async (file, setProgress) => {
    try {
      setUploadLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('excelFile', file);

      if (setProgress) setProgress(30);

      const response = await Api.importCustomersExcel(formData);

      if (response.status === "success") {
        if (setProgress) setProgress(100);

        toast.success(response?.message || 'Excel file uploaded successfully!');
        setShowExcelModal(false);
        await fetchLeads();
      } else {
        const errorMessage = response.data?.message || 'Upload failed';
        throw new Error(errorMessage);
      }

    } catch (err) {
      if (setProgress) setProgress(0);
      throw new Error(err.message || 'Failed to upload Excel file. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Excel Export Handler
  const handleExcelExport = async () => {
    try {
      setExportLoading(true);
      setShowExcelDropdown(false);

      const response = await Api.exportCustomersExcel(searchTerm);

      if (response.status === "success" && response.data) {
        // If your API returns a file URL or path
        if (response.data.filePath) {
          // Create download link from the file path
          const url = `${import.meta.env.VITE_API_URL}${response.data.filePath}`;
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';

          // Set filename with current date
          const date = new Date().toISOString().split('T')[0];
          link.download = `customers_${date}.xlsx`;

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // If your API returns the file as binary data
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          const date = new Date().toISOString().split('T')[0];
          link.download = `customers_${date}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }

        toast.success('Excel file downloaded successfully!');
      } else {
        throw new Error(response.message || 'Failed to export data');
      }
    } catch (err) {
      setError(err.message || 'Failed to export Excel file. Please try again.');
      console.error('Error exporting Excel:', err);
      toast.error('Failed to export Excel file');
    } finally {
      setExportLoading(false);
    }
  };

  // WhatsApp Message Handler
  const handleSendWhatsAppMessage = async (messageData) => {
    try {
      setMessageLoading(true);

      // Use the correct API method signature from your apiService
      const response = await Api.sendWhatsAppMessage(messageData.lead._id, {
        message: messageData.message
      });

      if (response.status === "success") {
        toast.success(`✅ WhatsApp message sent to ${messageData.lead.name}!`);
        setShowWhatsAppModal(false);
        setSelectedLead(null);
      } else {
        throw new Error(response.message || 'Failed to send message');
      }

    } catch (err) {
      setError(err.message || 'Failed to send WhatsApp message');
      throw err;
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingLead(null);
    setShowForm(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingLead) {
        await Api.updateLead(editingLead._id, formData);
      } else {
        await Api.createLead(formData);
      }

      resetForm();
      setCurrentPage(1);
      fetchLeads();
    } catch (err) {
      setError(err.message || `Failed to ${editingLead ? 'update' : 'create'} lead. Please try again.`);
      console.error('Error saving lead:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone
    });
    setShowForm(true);
  };

  const handleDeleteClick = (lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;

    try {
      setDeleteLoading(true);
      await Api.deleteLead(deletingLead._id);

      setShowDeleteModal(false);
      setDeletingLead(null);
      setDeleteLoading(false);

      setTableRefreshLoading(true);
      await fetchLeads();

    } catch (error) {
      setError(error.message || 'Failed to delete lead. Please try again.');
      console.error('Error deleting lead:', error);
    } finally {
      setTableRefreshLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingLead(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Showing {leads.length} of {totalResults} customer{totalResults !== 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            {searchTerm && ` • Searching for "${searchTerm}"`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex justify-between items-center">
            {/* Search Info */}
            <div className="flex-1 mr-2">
              {searchTerm && (
                <p className="text-sm text-gray-600">
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearchInputChange}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              {/* Excel Dropdown Button */}
              {/* Excel Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExcelDropdown(!showExcelDropdown)}
                  className="flex items-center gap-2 px-2 py-2 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {exportLoading ? (
                    <Loader className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <Sheet className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Excel</span>
                  <div className="h-5 w-px bg-gray-300" />
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showExcelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showExcelDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowExcelModal(true);
                        setShowExcelDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-center text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="font-medium">Import</span>
                    </button>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={handleExcelExport}
                      disabled={exportLoading || leads.length === 0}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-center text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                      {exportLoading ? (
                        <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span className="font-medium">Export</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showExcelDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowExcelDropdown(false)}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${error.includes('✅')
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
          {error.includes('✅') ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        show={showForm}
        onClose={resetForm}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        editingLead={editingLead}
        submitting={submitting}
      />

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        onUpload={handleExcelUpload}
        templateUrl="/templates/sample.xlsx"
        templateFileName="leads_template.xlsx"
        uploadLoading={uploadLoading}
        allowedFileTypes={['.xlsx']}
        maxFileSize={10 * 1024 * 1024}
        instructions={[
          'Required columns: Name, Email, Phone',
          'Ensure data follows the correct format in sample template',
          'Remove any empty rows before uploading',
          'File will be processed immediately after upload'
        ]}
      />

      {/* WhatsApp Campaign Modal */}
      <WhatsAppCampaignModal
        isOpen={showWhatsAppModal}
        onClose={() => {
          setShowWhatsAppModal(false);
          setSelectedLead(null);
        }}
        selectedLead={selectedLead}
        onSendMessage={handleSendWhatsAppMessage}
        isLoading={messageLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingLead(null);
        }}
        onConfirm={handleDeleteConfirm}
        description={
          <p>
            Are you sure you want to delete the lead <strong>"{deletingLead?.name}"</strong>?
            This action cannot be undone.
          </p>
        }
        isLoading={deleteLoading}
      />

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {tableRefreshLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="ml-3 text-gray-600">Refreshing data...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No leads found matching your search' : 'No leads found'}
            </p>
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first lead
                </button>
                <span className="text-gray-400">or</span>
                <button
                  onClick={() => setShowExcelModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upload Excel file
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              src={lead.photo || userLogo}
                              alt={lead.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-normal text-gray-900 capitalize">{lead.name}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{lead.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          {/* WhatsApp Button */}
                          {lead.phone && (
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowWhatsAppModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Send WhatsApp message"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleEdit(lead)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit lead"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(lead)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
    </div>
  );
};

export default Customers;