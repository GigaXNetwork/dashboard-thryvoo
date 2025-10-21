// // components/Support/SupportCard.jsx (Modal Version)
// import React, { useState } from 'react';
// import { Edit, Trash2, MessageCircle, Plus, List } from 'lucide-react';
// import { FaQuestionCircle } from 'react-icons/fa';

// const SupportCard = ({
//     item,
//     onEdit,
//     onDelete,
//     onAddFAQ,
//     onEditFAQ,
//     onDeleteFAQ,
//     loading
// }) => {
//     const [showFAQModal, setShowFAQModal] = useState(false);

//     const renderIcon = (icon) => {
//         return <FaQuestionCircle className="w-8 h-8 text-blue-600" />;
//     };

//     return (
//         <>
//             <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
//                 {/* Header Section */}
//                 <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                         {renderIcon(item.help_cat_icon)}
//                         <h3 className="text-xl font-semibold text-gray-900">
//                             {item.help_cat_name}
//                         </h3>
//                     </div>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => onAddFAQ(item)}
//                             disabled={loading}
//                             className="p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
//                             title="Add FAQ"
//                         >
//                             <Plus className="w-4 h-4" />
//                         </button>
//                         <button
//                             onClick={() => onEdit(item)}
//                             disabled={loading}
//                             className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
//                         >
//                             <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                             onClick={() => onDelete(item._id)}
//                             disabled={loading}
//                             className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
//                         >
//                             <Trash2 className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
//                     {item.help_cat_description}
//                 </p>

//                 {/* FAQs Preview */}
//                 {item.faqs && item.faqs.length > 0 && (
//                     <div className="mb-4">
//                         <div className="text-sm text-gray-600 mb-2">
//                             <strong>{item.faqs.length} FAQ{item.faqs.length !== 1 ? 's' : ''}</strong>
//                         </div>
//                         <div className="space-y-1 max-h-20 overflow-y-auto">
//                             {item.faqs.slice(0, 1).map((faq, index) => (
//                                 <div key={faq._id} className="text-sm text-gray-700 truncate">
//                                     {index + 1}. {faq.question}
//                                 </div>
//                             ))}
//                             {item.faqs.length > 3 && (
//                                 <div className="text-xs text-blue-600">
//                                     +{item.faqs.length - 3} more FAQs
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
//                     <div className="flex items-center gap-2">
//                         <MessageCircle className="w-4 h-4" />
//                         <span>Support Category</span>
//                     </div>

//                     <div className="flex gap-2">
//                         {item.faqs && item.faqs.length > 0 && (
//                             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                                 <button
//                                     onClick={() => setShowFAQModal(true)}
//                                     className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
//                                 >
//                                     <List className="w-3 h-3" />
//                                     View {item.faqCount} FAQ{item.faqCount !== 1 ? 's' : ''}
//                                 </button>
//                             </span>
//                         )}

//                     </div>
//                 </div>
//             </div>

//             {/* FAQ Modal */}
//             {showFAQModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg w-full max-w-2xl mx-auto p-6 max-h-[80vh] overflow-y-auto">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-semibold text-gray-900">
//                                 FAQs - {item.help_cat_name}
//                             </h3>
//                             <button
//                                 onClick={() => setShowFAQModal(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <List className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="space-y-4">
//                             {item.faqs.map((faq, index) => (
//                                 <div key={faq._id} className="border border-gray-200 rounded-lg p-4">
//                                     <div className="flex items-start justify-between mb-2">
//                                         <h4 className="font-medium text-gray-900 flex-1">
//                                             {index + 1}. {faq.question}
//                                         </h4>
//                                         <div className="flex gap-2 ml-4">
//                                             <button
//                                                 onClick={() => {
//                                                     setShowFAQModal(false);
//                                                     onEditFAQ(item, faq);
//                                                 }}
//                                                 className="p-1 text-blue-600 hover:text-blue-700"
//                                                 title="Edit FAQ"
//                                             >
//                                                 <Edit className="w-4 h-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setShowFAQModal(false);
//                                                     onDeleteFAQ(item._id, faq._id, faq.question);
//                                                 }}
//                                                 className="p-1 text-red-600 hover:text-red-700"
//                                                 title="Delete FAQ"
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
//                                         {faq.answer}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex justify-end mt-6">
//                             <button
//                                 onClick={() => setShowFAQModal(false)}
//                                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default SupportCard;



// components/Support/SupportCard.jsx
import React, { useState } from 'react';
import { Edit, Trash2, MessageCircle, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { FaQuestionCircle } from 'react-icons/fa';

const SupportCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  onAddFAQ, 
  onEditFAQ, 
  onDeleteFAQ, 
  loading 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const renderIcon = (icon) => {
    return <FaQuestionCircle className="w-8 h-8 text-blue-600" />;
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
      {/* Main Row - Always Visible */}
      <div className="flex items-center justify-between p-6">
        {/* Left Side - Content */}
        <div className="flex items-center gap-4 flex-1">
          {renderIcon(item.help_cat_icon)}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {item.help_cat_name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              {item.help_cat_description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {item.faqs && item.faqs.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {item.faqs.length} FAQ{item.faqs.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={toggleExpanded}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:gap-3"
              >
                {isExpanded ? (
                  <>
                    <span className="text-sm font-medium">Hide</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">Show</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
            <button
              onClick={() => onAddFAQ(item)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 disabled:opacity-50 transform hover:scale-110"
              title="Add FAQ"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(item)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 transform hover:scale-110"
              title='Edit Item'
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item._id)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 transform hover:scale-110"
              title='Delete item'
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={`
        transition-all duration-500 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        {item.faqs && item.faqs.length > 0 && (
          <div className="border-t border-gray-200 bg-white rounded-b-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Frequently Asked Questions
                </h4>
                <span className="text-sm text-gray-500">
                  {item.faqs.length} question{item.faqs.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {item.faqs.map((faq, index) => (
                  <div 
                    key={faq._id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <button
                          onClick={() => toggleFAQ(faq._id)}
                          className="w-full text-left flex items-start gap-4 group"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {faq.question}
                            </h5>
                            <div className={`
                              transition-all duration-500 ease-in-out overflow-hidden
                              ${expandedFAQ === faq._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                            `}>
                              <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                {faq.answer}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => onEditFAQ(item, faq)}
                          disabled={loading}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 disabled:opacity-50 transform hover:scale-110"
                          title="Edit FAQ"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteFAQ(item._id, faq._id, faq.question)}
                          disabled={loading}
                          className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 disabled:opacity-50 transform hover:scale-110"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportCard;