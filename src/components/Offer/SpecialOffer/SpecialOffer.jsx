// components/SpecialOffer/SpecialOffer.jsx
import React, { useState, useEffect } from "react";
import { Api } from "../../../Context/apiService";
import SpecialOfferList from "./SpecialOfferList";
import DeleteConfirmationModal from "../../Common/DeleteConfirmationModal";
import CouponPresetSelector from "../../Spinning/CouponPresetSelector";
import OfferForm from "../../Coupon/presetForm";
import AddChoiceModal from "../../Common/AddChoiceModal";
import SpecialOfferPresetSelector from "./SpecialOfferPresetSelector";
import MessagePopup from "../../Common/MessagePopup";

const SpecialOffer = () => {
  const [specialOfferData, setSpecialOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [isSpecialOfferEnabled, setSpecialOfferEnabled] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // New states for choice modal and forms
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  const [formData, setFormData] = useState({
    presetName: "",
    discountType: "percentage",
    discountAmount: "",
    maxDiscount: "",
    minPurchase: "",
    conditions: [""],
    link: "",
    usageLimit: "",
    type: "own",
    day: null,
    hour: null,
    startAt: null,
    expireAt: null
  });
  const [formLoading, setFormLoading] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
  }

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  }

  const fetchSpecialOfferData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const data = await Api.getMySpecialOffers();

      if (data.status === "success") {
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
        showMessage("Special offer session created successfully!", "success");
        await fetchSpecialOfferData();
      } else {
        showMessage(data.message || "Failed to create special offer", "error");
      }
    } catch (err) {
      showMessage("Failed to create special offer session", "error");
      console.error("Error creating special offer:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle choice modal actions
  const handleAddItemClick = () => {
    setShowChoiceModal(true);
  };

  const handleSelectPreset = () => {
    setShowChoiceModal(false);
    setShowPresetSelector(true);
  };

  const handleCreateCustomPreset = () => {
    setShowChoiceModal(false);
    setShowOfferForm(true);
  };

  const handleAddItem = async (itemObj) => {
    console.log("itemObj received in handleAddItem:", itemObj);
    setAddError(null);

    if (!Array.isArray(itemObj) || itemObj.length === 0) {
      setAddError("No items selected");
      return;
    }

    const existingItems = specialOfferData?.items || [];
    let successCount = 0;
    let errors = [];

    try {
      // Process each item sequentially
      for (const item of itemObj) {
        // Check if item already exists in current special offer
        if (existingItems.find((existingItem) => existingItem._id === item._id)) {
          errors.push(`"${item.presetName}" already exists in special offer`);
          continue;
        }

        // Send the API request for each item
        const data = await Api.addSpecialOfferItem(item._id);

        if (data.status === "success") {
          successCount++;
        } else {
          errors.push(`Failed to add "${item.presetName}": ${data.message}`);
        }
      }

      // Handle the results
      if (successCount > 0) {
        if (successCount === itemObj.length) {
          showMessage(`${successCount} coupon preset${successCount !== 1 ? 's' : ''} added successfully!`, 'success');
        } else {
          showMessage(`Added ${successCount} item${successCount !== 1 ? 's' : ''} successfully!`, 'success');
        }

        // Refresh the data
        await fetchSpecialOfferData();
        setShowPresetSelector(false);

        // Show any errors that occurred
        if (errors.length > 0) {
          setAddError(`Some items failed: ${errors.join(', ')}`);
        }
      } else {
        setAddError(errors.join(', ') || "Failed to add items");
      }

    } catch (err) {
      setAddError("Something went wrong. Please try again.");
      console.error("Error adding coupon presets:", err);
    }
  };

  // Handle creating new coupon
  const handleCreateSpecialOfferCoupon = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await Api.createSpecialOfferCoupon(formData);

      if (response.status === "success") {
        showMessage("Special offer coupon created successfully!", "success");
        await fetchSpecialOfferData();

        // Reset form and close
        resetForm();
        setShowOfferForm(false);
      } else {
        showMessage(response.message || "Failed to create special offer coupon", "error");
      }
    } catch (err) {
      showMessage("Failed to create special offer coupon", "error");
      console.error("Error creating special offer coupon:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemoveError(null);
      const data = await Api.removeSpecialOfferItem(itemId);

      if (data.status === "success") {
        showMessage("Coupon preset removed from special offer successfully!", "success");
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
        showMessage("Failed to toggle special offer", "error");
      } else {
        showMessage(`Special offer ${newStatus ? 'enabled' : 'disabled'} successfully!`, "success");
        await fetchSpecialOfferData();
      }
    } catch (err) {
      setSpecialOfferEnabled(!newStatus);
      showMessage("Network error: Could not toggle special offer", "error");
      console.error("Error toggling special offer:", err);
    } finally {
      setIsToggling(false);
    }
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      presetName: "",
      discountType: "percentage",
      discountAmount: "",
      maxDiscount: "",
      minPurchase: "",
      conditions: [""],
      link: "",
      usageLimit: "",
      type: "own",
      day: null,
      hour: null,
      startAt: null,
      expireAt: null
    });
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

  const hasSpecialOfferSession = specialOfferData && specialOfferData._id;
  const hasItems = specialOfferData?.items?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Message Popup */}
        {message.text && (
          <MessagePopup
            message={message.text}
            type={message.type}
            onClose={closeMessage}
          />
        )}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Special Offers</h1>
              <p className="text-gray-600">Manage your special offer campaigns and coupon presets</p>
            </div>

            {/* Toggle Switch - Only show if special offer session exists */}
            {hasSpecialOfferSession && (
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
            {!hasSpecialOfferSession ? (
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
            ) : !hasItems ? (
              // Session exists but no items - Show add first item UI
              <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Your First Offer</h2>
                <p className="text-gray-600 mb-8">
                  Your special offer session is ready! Add your first coupon preset to get started.
                </p>
                <button
                  onClick={handleAddItemClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Add First Coupon Preset
                </button>
              </div>
            ) : (
              <SpecialOfferList
                items={specialOfferData.items || []}
                openModal={handleAddItemClick}
                onRemoveItem={confirmRemoveItem}
                error={removeError || fetchError}
              />
            )}
          </div>
        </div>
      </div>

      {/* Choice Modal */}
      <AddChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onSelectPreset={handleSelectPreset}
        onCreateCustom={handleCreateCustomPreset}
        title="Add Special Offer"
        description="Choose how you want to add a coupon preset"
      />

      {/* Preset Selector Modal */}
      {showPresetSelector && (
        <SpecialOfferPresetSelector
          existingPresets={specialOfferData?.items?.map((item) => item._id) || []}
          onAddItems={handleAddItem} // Note: changed from onAddSpin to onAddItems
          onClose={() => {
            setShowPresetSelector(false);
            setAddError("");
          }}
          error={addError}
        />
      )}

      {/* Custom Preset Form Modal */}
      <OfferForm
        showForm={showOfferForm}
        setShowForm={setShowOfferForm}
        form={formData}
        handleChange={handleFormChange}
        handleSubmit={handleCreateSpecialOfferCoupon}
        resetForm={resetForm}
        loading={formLoading}
        isEditing={false}
        title="Create Special Offer Coupon"
        type="own"
        onClose={() => {
          setShowOfferForm(false);
          resetForm();
        }}
      />

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