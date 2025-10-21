// components/SpecialOffer/SpecialOffer.jsx
import React, { useState, useEffect } from "react";
import { Api } from "../../../Context/apiService";
import { toast } from "react-toastify";
import SpecialOfferList from "./SpecialOfferList";
import DeleteConfirmationModal from "../../Common/DeleteConfirmationModal";
import CouponPresetSelector from "../../Spinning/CouponPresetSelector";

const SpecialOffer = () => {
  const [specialOfferData, setSpecialOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpecialOfferEnabled, setSpecialOfferEnabled] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  const fetchSpecialOfferData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const data = await Api.getMySpecialOffers();

      console.log("Special Offer API Response:", data);

      if (data.status === "success") {
        // Fix: Access the correct data structure from your API response
        setSpecialOfferData(data.data.items || { items: [] });
        if (typeof data.data.items?.isActive === "boolean") {
          setSpecialOfferEnabled(data.data.items.isActive);
        }
      } else if (data.status === "fail") {
        setSpecialOfferData(null);
      } else {
        setFetchError(data.message || "Failed to fetch special offer data");
      }
    } catch (err) {
      setFetchError("Network error: Could not fetch special offer data");
      console.error("Error fetching special offer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialOfferData();
  }, []);

  const handleCreateSpecialOffer = async () => {
    try {
      setLoading(true);
      const data = await Api.createSpecialOffer();
      
      if (data.status === "success") {
        toast.success("Special offer session created successfully!");
        await fetchSpecialOfferData();
        setIsModalOpen(true);
      } else {
        toast.error(data.message || "Failed to create special offer");
      }
    } catch (err) {
      toast.error("Failed to create special offer session");
      console.error("Error creating special offer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemObj) => {
    setAddError(null);

    if (!itemObj || !itemObj._id) {
      setAddError("Invalid item");
      return;
    }

    const items = specialOfferData?.items || [];

    // Check if item already exists
    if (items.find((item) => item._id === itemObj._id)) {
      setAddError("This coupon preset already exists in special offer");
      return;
    }

    try {
      const data = await Api.addSpecialOfferItem(itemObj._id);
      
      if (data.status === "success") {
        toast.success("Coupon preset added to special offer successfully!");
        await fetchSpecialOfferData();
        setIsModalOpen(false);
      } else {
        setAddError(data.message || "Failed to add coupon preset");
      }
    } catch (err) {
      setAddError("Something went wrong. Please try again.");
      console.error("Error adding coupon preset:", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemoveError(null);
      const data = await Api.removeSpecialOfferItem(itemId);

      if (data.status === "success") {
        toast.success("Coupon preset removed from special offer successfully!");
        // Update local state immediately
        setSpecialOfferData(prev => ({
          ...prev,
          items: prev.items.filter((item) => item._id !== itemId)
        }));
      } else {
        setRemoveError(data.message || "Failed to remove coupon preset");
      }
    } catch (err) {
      setRemoveError("Network error: Could not remove coupon preset");
      console.error("Error removing coupon preset:", err);
    }
  };

  const confirmRemoveItem = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleToggleSpecialOffer = async () => {
    if (!specialOfferData?._id) return;

    setIsToggling(true);
    const newStatus = !isSpecialOfferEnabled;
    setSpecialOfferEnabled(newStatus);

    try {
      const data = await Api.toggleSpecialOffer(specialOfferData._id);

      if (data.status !== "success") {
        setSpecialOfferEnabled(!newStatus);
        toast.error("Failed to toggle special offer");
      } else {
        toast.success(`Special offer ${newStatus ? 'enabled' : 'disabled'} successfully!`);
        // Refresh data to get updated status
        await fetchSpecialOfferData();
      }
    } catch (err) {
      setSpecialOfferEnabled(!newStatus);
      toast.error("Network error: Could not toggle special offer");
      console.error("Error toggling special offer:", err);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading special offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Special Offers</h1>
              <p className="text-gray-600">Manage your special offer campaigns and coupon presets</p>
            </div>

            {/* Toggle Switch - Only show if special offer session exists */}
            {specialOfferData && (
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={handleToggleSpecialOffer}
                  disabled={isToggling}
                  aria-pressed={isSpecialOfferEnabled}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${isSpecialOfferEnabled ? "bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-300" : "bg-gray-300 focus:ring-gray-200"}
                  ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isSpecialOfferEnabled ? "translate-x-9" : "translate-x-1"}`}
                  />
                </button>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold leading-tight ${isSpecialOfferEnabled ? "text-blue-700" : "text-gray-700"}`}>
                    {isSpecialOfferEnabled ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-500">Special Offer Status</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-full">
            {!specialOfferData ? (
              <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Setup Special Offers</h2>
                <p className="text-gray-600 mb-8">
                  No special offer session found. Create a session to start adding coupon presets.
                </p>
                <button
                  onClick={handleCreateSpecialOffer}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Special Offer Session"}
                </button>
              </div>
            ) : (
              <SpecialOfferList
                items={specialOfferData.items || []}
                openModal={() => setIsModalOpen(true)}
                onRemoveItem={confirmRemoveItem}
                error={removeError || fetchError}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <CouponPresetSelector
          existingPresets={specialOfferData?.items?.map((item) => item._id) || []}
          onAddSpin={handleAddItem}
          onClose={() => {
            setIsModalOpen(false);
            setAddError("");
          }}
          error={addError}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        description="Are you sure you want to remove this coupon preset from special offer? This action cannot be undone."
        confirmButtonText="Remove"
        onConfirm={async () => {
          if (!selectedItemId) return;
          await handleRemoveItem(selectedItemId);
          setSelectedItemId(null);
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default SpecialOffer;