import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPercentage, FaGift } from "react-icons/fa";
import { MdDiscount } from 'react-icons/md';

// Icons for discount types
const DiscountIcons = {
  percentage: () => <FaPercentage />,
  fixed: () => <MdDiscount size={24} color="red" />,
  custom: ()=> <FaGift />,
  default: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
};

// Animation variants for Framer Motion
const accordionVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.2, ease: "easeInOut" }
    }
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.3, ease: "easeInOut", delay: 0.1 }
    }
  }
};

const chevronVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 }
};

// Accordion Item Component
const SpinAccordionItem = ({ spin, isOpen, onToggle, index }) => {
  return (
    <motion.div 
      className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
      initial={false}
      animate={{ backgroundColor: isOpen ? "#f9fafb" : "#ffffff" }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-100"
        onClick={onToggle}
        aria-expanded={isOpen}
        whileHover={{ backgroundColor: "#f9fafb" }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              {spin.discountType ? (
                DiscountIcons[spin.discountType] ? 
                DiscountIcons[spin.discountType]() : 
                DiscountIcons.default()
              ) : (
                DiscountIcons.default()
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{spin.presetName || 'Unnamed Offer'}</div>
              <div className="text-sm text-gray-500">{spin.type || 'Standard'}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-900">
              {spin.discountType === 'percentage' ? `${spin.discountAmount}%` : ''}
              {spin.discountType === 'fixed' ? `$${spin.discountAmount}` : ''}
              {spin.discountType === 'custom' ? 'FREE' : ''}
              {!spin.discountType && spin.discountAmount ? `${spin.discountAmount}` : ''}
              {!spin.discountType && !spin.discountAmount ? 'N/A' : ''}
            </div>
            <motion.svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              variants={chevronVariants}
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={accordionVariants}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Discount Details</h4>
                  <p className="text-gray-600">
                    Type: <span className="capitalize">{spin.discountType || 'Unknown'}</span>
                  </p>
                  <p className="text-gray-600">
                    Amount: {spin.discountType === 'percentage' ? `${spin.discountAmount}%` : ''}
                    {spin.discountType === 'fixed' ? `$${spin.discountAmount}` : ''}
                    {spin.discountType === 'free' ? 'FREE' : ''}
                    {!spin.discountType && spin.discountAmount ? `${spin.discountAmount}` : ''}
                    {!spin.discountType && !spin.discountAmount ? 'N/A' : ''}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Validity Period</h4>
                  <p className="text-gray-600">
                    {spin.startAt ? `Starts: ${new Date(spin.startAt).toLocaleDateString()}` : 'Starts: Immediately'}
                  </p>
                  <p className="text-gray-600">
                    {spin.expireAt ? `Expires: ${new Date(spin.expireAt).toLocaleDateString()}` : 'No expiration'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Additional Info</h4>
                  <p className="text-gray-600">ID: {spin._id}</p>
                  <p className="text-gray-600">Offer Type: {spin.type || 'Standard'}</p>
                </div>
                
                <div className="flex items-end">
                  <motion.button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Spin List Component with Accordion
const SpinList = ({ spins }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!spins || spins.length === 0) {
    return (
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Spin List</h2>
        <p className="text-gray-500 text-center py-4">No spins available</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Spin List</h2>
      <p className="text-sm text-gray-500 mb-4">Click on an item to view details</p>
      
      <div>
        {spins.map((spin, index) => (
          <SpinAccordionItem
            key={index}
            spin={spin}
            isOpen={openIndex === index}
            onToggle={() => toggleAccordion(index)}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SpinList;