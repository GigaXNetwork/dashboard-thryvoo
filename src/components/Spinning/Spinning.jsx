import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SpinList from "./SpinList";
import CouponPresetSelector from "./CouponPresetSelector";
import { apiRequest } from "../../Context/apiService";
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";
import { toast } from "react-toastify";

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

  const token = Cookies.get("authToken");
  const apiUrl = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    if (token) fetchSpinData();
  }, [token]);

  // const handleAddSpin = async (presetObj) => {
  //   setAddError(null);

  //   if (!presetObj || !presetObj._id) {
  //     setAddError("Invalid preset");
  //     return;
  //   }

  //   const spins = spinData?.spins || [];

  //   if (spins.length >= 5) {
  //     setAddError("Maximum limit of 5 spins reached");
  //     return;
  //   }

  //   if (spins.find((s) => s._id === presetObj._id)) {
  //     setAddError("This spin already exists");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/spin/add-items`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${token}`,
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ itemId: presetObj._id }),
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.status !== "success") {
  //       setAddError(data.message || "Failed to add spin");
  //       return;
  //     }

  //     // Refetch spin data after adding
  //     await fetchSpinData();
  //     setIsModalOpen(false);
  //   } catch (err) {
  //     setAddError("Something went wrong. Please try again.");
  //   }
  // };


  const handleAddSpin = async (presetOrPresets) => {
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
          toast.success(`${successCount} spin item${successCount !== 1 ? 's' : ''} added successfully!`);
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
      } else {
        setRemoveError(data.message || "Failed to remove spin item");
      }
    } catch (err) {
      setRemoveError("Network error: Could not remove spin item");
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
      }
    } catch {
      setSpinningEnabled((prev) => !prev);
      alert("Network error: Could not toggle spinning");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Spinning Management</h1>
              <p className="text-gray-600">Manage your spin-the-wheel campaigns and rewards</p>
            </div>

            {/* Toggle Switch */}
            {spinData && (
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={handleToggleSpinning}
                  aria-pressed={isSpinningEnabled}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${isSpinningEnabled ? "bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-300" : "bg-gray-300 focus:ring-gray-200"}`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isSpinningEnabled ? "translate-x-9" : "translate-x-1"}`}
                  />
                </button>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold leading-tight ${isSpinningEnabled ? "text-blue-700" : "text-gray-700"}`}>
                    {isSpinningEnabled ? "Enabled" : "Disabled"}
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
            {!spinData || spinData.spins?.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Setup Spins</h2>
                <p className="text-gray-600 mb-8">
                  No spin data found. Please set up your spins to get started.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Create Your First Spin
                </button>
              </div>
            ) : (
              <SpinList
                spins={spinData.spins}
                openModal={() => setIsModalOpen(true)}
                onRemoveSpin={confirmRemoveSpin}
                error={removeError || fetchError}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Spin Modal */}
      {isModalOpen && (
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
