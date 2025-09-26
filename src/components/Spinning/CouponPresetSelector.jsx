import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CouponPresetSelector = ({
  existingPresets = [],
  onAddSpin,
  onClose,
  error: parentError
}) => {
  const [presets, setPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enabled, setEnabled] = useState(true); // toggle state

  // Load presets
  const fetchPresets = async () => {
    setLoading(true);
    setError('');
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/coupon/presetsName`, {
        headers: { Authorization: `${token}` },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch presets');
      setPresets(data.data.presetsName || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch presets');
    } finally {
      setLoading(false);
    }
  };

  // Filter out existing presets
  useEffect(() => {
    const existingIds = existingPresets.map(p => (typeof p === 'string' ? p : p._id));
    if (presets.length > 0 && existingIds.length > 0) {
      setFilteredPresets(presets.filter(p => !existingIds.includes(p._id)));
    } else {
      setFilteredPresets(presets);
    }
  }, [presets, existingPresets]);

  // Load presets & toggle state on mount
  useEffect(() => {
    fetchPresets();
    const savedState = localStorage.getItem('couponEnabled');
    if (savedState !== null) setEnabled(JSON.parse(savedState));
  }, []);

  // Toggle handler
  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    localStorage.setItem('couponEnabled', JSON.stringify(newState));

    // Optional: call API to save globally
    // fetch(`${import.meta.env.VITE_API_URL}/api/coupon/toggle`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ enabled: newState })
    // });
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPreset) {
      setError('Please select a preset');
      return;
    }
    const presetObj = presets.find(p => p._id === selectedPreset);
    if (presetObj && onAddSpin) {
      onAddSpin(presetObj);
    } else {
      setError('Invalid preset selected');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✕</button>

        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Select Coupon Preset</h2>

          {/* Toggle switch */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={handleToggle}
              className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>


        {(error || parentError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error || parentError}
          </div>
        )}

        {loading && !presets.length && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}

        {filteredPresets.length > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredPresets.map((preset) => (
                <label key={preset._id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="preset"
                    value={preset._id}
                    checked={selectedPreset === preset._id}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{preset.presetName}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || !selectedPreset}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading || !selectedPreset ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Processing...' : 'Add Selected Item'}
            </button>
          </form>
        ) : (
          !loading && <div className="text-center py-4 text-gray-500">No presets available</div>
        )}

        {presets.length > 0 && (
          <button
            onClick={fetchPresets}
            disabled={loading}
            className="mt-4 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Refresh Presets
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponPresetSelector;
