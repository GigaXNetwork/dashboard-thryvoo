import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SpinList from "./SpinList";
import CouponPresetSelector from "./CouponPresetSelector";
import SpinningWheel from "./SpinningWheel";
import { apiRequest } from "../../Context/apiService";

const Spinning = () => {
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinningEnabled, setSpinningEnabled] = useState(true);

  const token = Cookies.get("authToken");

  const spinId = spinData?._id;

  const fetchSpinData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const data = await apiRequest(
        "/api/spin/my-spins",
        "GET",
        null,
        { Authorization: `${token}` }
      );

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

  const handleToggleSpinning = async () => {
    if (!spinId) return;

    try {
      const response = await fetch(`https://api.thryvoo.com/api/spin/${spinId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success" && data.data) {
        setSpinningEnabled(data.data.isActive);
      } else {
        alert(data.message || "Failed to toggle spinning");
      }
    } catch {
      alert("Network error: Could not toggle spinning");
    }
  };

  // Add and Remove handlers can be filled here as per your existing logic.

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!spinData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Spins</h2>
          <p className="text-gray-600 mb-6">
            No spin data found. Please set up your spins to get started.
          </p>
          {/* Include your create spin button */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
            Spinning Management
          </h1>
          <div className="flex items-center space-x-3 mr-5 border p-3 rounded-full bg-white shadow-sm">
            <button
              type="button"
              onClick={handleToggleSpinning}
              aria-pressed={isSpinningEnabled}
              className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none
                ${isSpinningEnabled ? "bg-blue-600" : "bg-gray-300"}`}
              style={{ minWidth: '4rem' }}
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                  ${isSpinningEnabled ? "translate-x-8" : "translate-x-0"}`}
              />
            </button>
            <span className={`ml-2 text-base font-semibold ${isSpinningEnabled ? "text-blue-700" : "text-gray-500"}`}>
              {isSpinningEnabled ? "Spinning Enabled" : "Spinning Disabled"}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <SpinList
              spins={spinData.spins}
              openModal={() => setIsModalOpen(true)}
              onRemoveSpin={() => { }}
              onToggleActive={() => { }}
              error={removeError || fetchError}
            />
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="sticky top-20">
              <SpinningWheel spins={spinData.spins.filter((s) => s.active !== false)} />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CouponPresetSelector
          existingPresets={spinData.spins.map((s) => s._id)}
          onAddSpin={() => { }}
          onClose={() => setIsModalOpen(false)}
          error={addError}
        />
      )}
    </div>
  );
};

export default Spinning;
