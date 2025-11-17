import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SpinList from "./SpinList";
import CouponPresetSelector from "./CouponPresetSelector";
import { apiRequest } from "../../Context/apiService";
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";
import MessagePopup from "../Common/MessagePopup";
import OfferForm from "../Coupon/presetForm";
import AddChoiceModal from "../Common/AddChoiceModal";

const Spinning = () => {
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinningEnabled, setSpinningEnabled] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSpinId, setSelectedSpinId] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [creatingCustomPreset, setCreatingCustomPreset] = useState(false);

  // New states for the choice modal and custom preset form
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showCustomPresetForm, setShowCustomPresetForm] = useState(false);
  const [customPresetForm, setCustomPresetForm] = useState({
    presetName: "",
    discountType: "percentage",
    discountAmount: "",
    maxDiscount: "",
    minPurchase: "",
    usageLimit: "",
    link: "",
    type: "offer",
    conditions: [""],
    day: "",
    hour: ""
  });

  const token = Cookies.get("authToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
  };

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  };

  const fetchSpinData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const data = await apiRequest("/api/spin/my-spins", "GET");

      if (data.status === "success") {
        setSpinData(data.data.spin || { spins: [] });
        if (typeof data.data.spin?.isActive === "boolean") {
          setSpinningEnabled(data.data.spin.isActive);
        }
      } else {
        setFetchError(data.message || "Failed to fetch spin data");
      }
    } catch (err) {
      setFetchError("Network error: Could not fetch spin data");
    } finally {
      setLoading(false);
    }
  };

  const createSpinSession = async () => {
    try {
      setIsCreatingSession(true);
      const data = await apiRequest("/api/spin/create-spin", "POST");

      if (data.status === "success") {
        showMessage("Spinning session created successfully!", "success");
        await fetchSpinData(); // Refresh the data
      } else {
        showMessage(data.message || "Failed to create spinning session", "error");
      }
    } catch (err) {
      showMessage("Network error: Could not create spinning session", "error");
    } finally {
      setIsCreatingSession(false);
    }
  };

  useEffect(() => {
    if (token) fetchSpinData();
  }, [token]);

  // Handle opening the choice modal
  const handleAddSpinClick = () => {
    setShowChoiceModal(true);
  };

  // Handle preset selection from choice modal
  const handleSelectPreset = () => {
    setShowChoiceModal(false);
    setIsModalOpen(true);
  };

  // Handle custom preset creation from choice modal
  const handleCreateCustomPreset = () => {
    setShowChoiceModal(false);
    setShowCustomPresetForm(true);
  };

  // Handle custom preset form changes
  const handleCustomPresetChange = (e) => {
    const { name, value } = e.target;
    setCustomPresetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle custom preset form submission
  const handleCustomPresetSubmit = async (e) => {
    e.preventDefault();
    setCreatingCustomPreset(true);

    try {
      const presetResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/setCoupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            ...customPresetForm,
            maxDiscount: customPresetForm.maxDiscount ? parseFloat(customPresetForm.maxDiscount) : undefined,
            minPurchase: customPresetForm.minPurchase ? parseFloat(customPresetForm.minPurchase) : undefined,
            day: customPresetForm.day ? parseInt(customPresetForm.day) : undefined,
            usageLimit: customPresetForm.usageLimit ? parseInt(customPresetForm.usageLimit) : undefined,
          })
        }
      );

      const presetData = await presetResponse.json();

      if (presetData.status === "success") {
        const newPresetId = presetData.data.discount._id;
        await handleAddSpin({ _id: newPresetId, presetName: customPresetForm.presetName });

        setShowCustomPresetForm(false);
        setCustomPresetForm({
          presetName: "",
          discountType: "percentage",
          discountAmount: "",
          maxDiscount: "",
          minPurchase: "",
          usageLimit: "",
          link: "",
          type: "offer",
          conditions: [""],
          day: "",
          hour: ""
        });
      } else {
        showMessage(presetData.message || "Failed to create preset", "error");
      }
    } catch (err) {
      console.log("err", err)
      showMessage("Network error: Could not create preset", "error");
    } finally {
      setCreatingCustomPreset(false);
    }
  };

  // Reset custom preset form
  const resetCustomPresetForm = () => {
    setCustomPresetForm({
      presetName: "",
      discountType: "percentage",
      discountAmount: "",
      maxDiscount: "",
      minPurchase: "",
      usageLimit: "",
      link: "",
      type: "offer",
      conditions: [""],
      day: "",
      hour: ""
    });
  };

  const handleAddSpin = async (presetOrPresets) => {
    // Check if spin session exists
    if (!spinData || !spinData._id) {
      setAddError("Please create a spinning session first");
      return;
    }

    setAddError(null);

    // Handle both single preset and array of presets
    const presetsToAdd = Array.isArray(presetOrPresets) ? presetOrPresets : [presetOrPresets];

    const spins = spinData?.spins || [];

    // Check if adding these presets would exceed the limit
    if (spins.length + presetsToAdd.length > 5) {
      setAddError(`Cannot add ${presetsToAdd.length} items. Maximum limit of 5 spins would be exceeded.`);
      return;
    }

    let successCount = 0;
    let errors = [];

    try {
      // Process each preset sequentially
      for (const preset of presetsToAdd) {
        if (!preset || !preset._id) {
          errors.push("Invalid preset found");
          continue;
        }

        // Check if spin already exists
        if (spins.find((s) => s._id === preset._id)) {
          errors.push(`"${preset.presetName}" already exists`);
          continue;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/spin/add-items`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
              credentials: "include",
              body: JSON.stringify({ itemId: preset._id }),
            }
          );

          const data = await response.json();
          if (data.status === "success") {
            successCount++;
          } else {
            errors.push(`Failed to add "${preset.presetName}": ${data.message}`);
          }
        } catch (err) {
          errors.push(`Failed to add "${preset.presetName}": Network error`);
        }
      }

      if (successCount > 0) {
        if (successCount === presetsToAdd.length) {
          showMessage(`${successCount} spin item${successCount !== 1 ? 's' : ''} added successfully!`, "success");
          await fetchSpinData();
          setIsModalOpen(false);
        } else {
          setAddError(`Added ${successCount} item(s). ${errors.join(', ')}`);
          await fetchSpinData();
        }
      } else if (errors.length > 0) {
        setAddError(errors.join(', '));
      }

    } catch (err) {
      setAddError("Something went wrong. Please try again.");
    }
  };

  const handleRemoveSpin = async (itemId) => {
    try {
      setRemoveError(null);

      const data = await apiRequest("/api/spin/remove-items", "POST", { itemId });

      if (data.status === "success") {
        setSpinData((prev) => ({
          ...prev,
          spins: prev.spins.filter((s) => s._id !== itemId),
        }));
        showMessage("Spin item removed successfully!", "success");
      } else {
        setRemoveError(data.message || "Failed to remove spin item");
        showMessage(data.message || "Failed to remove spin item", "error");
      }
    } catch (err) {
      setRemoveError("Network error: Could not remove spin item");
      showMessage("Network error: Could not remove spin item", "error");
    }
  };

  const confirmRemoveSpin = (spinId) => {
    setSelectedSpinId(spinId);
    setDeleteModalOpen(true);
  };

  const handleToggleSpinning = async () => {
    if (!spinData?._id) return;

    setIsToggling(true);
    setSpinningEnabled((prev) => !prev);

    try {
      const data = await apiRequest(`/api/spin/${spinData._id}/toggle`, "POST");

      if (data.status !== "success") {
        setSpinningEnabled((prev) => !prev);
        showMessage("Failed to toggle spinning", "error");
      } else {
        showMessage(`Spinning ${!isSpinningEnabled ? 'enabled' : 'disabled'} successfully!`, "success");
      }
    } catch {
      setSpinningEnabled((prev) => !prev);
      showMessage("Network error: Could not toggle spinning", "error");
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading spins...</p>
        </div>
      </div>
    );
  }

  // Check if spin session exists
  const hasSpinSession = spinData && spinData._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      {/* Message Popup */}
      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={closeMessage}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Spinning Management</h1>
              <p className="text-gray-600">Manage your spin-the-wheel campaigns and rewards</p>
            </div>

            {/* Toggle Switch - Only show if session exists */}
            {hasSpinSession && (
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={handleToggleSpinning}
                  disabled={isToggling}
                  aria-pressed={isSpinningEnabled}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${isSpinningEnabled ? "bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-300" : "bg-gray-300 focus:ring-gray-200"}
                  ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isSpinningEnabled ? "translate-x-9" : "translate-x-1"}`}
                  />
                </button>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold leading-tight ${isSpinningEnabled ? "text-blue-700" : "text-gray-700"}`}>
                    {isSpinningEnabled ? "Enabled" : "Disabled"}
                    {isToggling && "..."}
                  </span>
                  <span className="text-xs text-gray-500">Spinning Status</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-full">
            {!hasSpinSession ? (
              // No spin session - Show create session UI
              <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Create Spinning Session</h2>
                <p className="text-gray-600 mb-8">
                  You need to create a spinning session before you can add spin items.
                </p>
                <button
                  onClick={createSpinSession}
                  disabled={isCreatingSession}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingSession ? "Creating Session..." : "Create Spinning Session"}
                </button>
              </div>
            ) : !spinData.spins || spinData.spins.length === 0 ? (
              // Session exists but no spins - Show add first spin UI
              <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Your First Spin</h2>
                <p className="text-gray-600 mb-8">
                  Your spinning session is ready! Add your first spin item to get started.
                </p>
                <button
                  onClick={handleAddSpinClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Add First Spin Item
                </button>
              </div>
            ) : (
              <SpinList
                spins={spinData.spins}
                openModal={handleAddSpinClick}
                onRemoveSpin={confirmRemoveSpin}
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
        title="Add Spin Item"
        description="Choose how you want to add a spin item"
      />

      {/* Add Spin Modal - Only show if session exists */}
      {isModalOpen && hasSpinSession && (
        <CouponPresetSelector
          existingPresets={spinData?.spins?.map((s) => s._id) || []}
          onAddSpin={handleAddSpin}
          onClose={() => {
            setIsModalOpen(false);
            setAddError("");
          }}
          error={addError}
        />
      )}

      {/* Custom Preset Form Modal */}
      {showCustomPresetForm && (
        <OfferForm
          showForm={showCustomPresetForm}
          setShowForm={setShowCustomPresetForm}
          form={customPresetForm}
          handleChange={(e) => handleCustomPresetChange(e)}
          handleSubmit={handleCustomPresetSubmit}
          resetForm={resetCustomPresetForm}
          loading={creatingCustomPreset}
          isEditing={false}
          title="Create Custom Preset"
          onClose={() => {
            setShowCustomPresetForm(false);
            resetCustomPresetForm();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        description="Are you sure you want to delete this spin item? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={async () => {
          if (!selectedSpinId) return;
          await handleRemoveSpin(selectedSpinId);
          setSelectedSpinId(null);
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default Spinning;