import React, { useState, useEffect } from "react";
import { X, Search, Check, Plus } from "lucide-react";
import { Api, getAuthToken } from "../../../Context/apiService";

const SpecialOfferPresetSelector = ({
    existingPresets = [],
    onAddItems,
    onClose,
    error
}) => {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    // Fetch available presets
    const fetchPresets = async () => {
        try {
            setLoading(true);
            setFetchError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/coupon/presetsName`, {
                headers: { Authorization: `${getAuthToken()}` },
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch presets');
            setPresets(data.data.presetsName || []);
        } catch (err) {
            setFetchError("Network error: Could not fetch presets");
            console.error("Error fetching presets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresets();
    }, [existingPresets]);

    // Filter presets: remove already added ones AND apply search filter
    const filteredPresets = presets
        .filter(preset => !existingPresets.includes(preset._id)) // Remove already added presets
        .filter(preset => 
            preset.presetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            preset.discountType?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleToggleSelect = (preset) => {
        setSelectedItems(prev => {
            const isSelected = prev.find(item => item._id === preset._id);
            if (isSelected) {
                return prev.filter(item => item._id !== preset._id);
            } else {
                return [...prev, preset];
            }
        });
    };

    const handleAddSelected = () => {
        if (selectedItems.length === 0) {
            return;
        }
        onAddItems(selectedItems);
    };

    const handleAddSingle = (preset) => {
        onAddItems([preset]);
    };

    const resetSelection = () => {
        setSelectedItems([]);
        setSearchTerm("");
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-white p-6 border-b rounded-t-2xl flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Add to Special Offer</h2>
                                    <p className="text-sm text-gray-500">Select coupon presets to add</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search presets by name or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Selection Info - NO LIMITS */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Selected: {selectedItems.length} presets
                                </span>
                                {selectedItems.length > 0 && (
                                    <button
                                        onClick={resetSelection}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Error Display */}
                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                            </div>
                        ) : fetchError ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                    <X className="w-6 h-6 text-red-600" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">Failed to load presets</p>
                                <p className="text-gray-500 text-sm mb-4">{fetchError}</p>
                                <button
                                    onClick={fetchPresets}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredPresets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <Search className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">
                                    {searchTerm ? "No matching presets found" : "No available presets"}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm
                                        ? "Try adjusting your search terms"
                                        : "All presets are already in special offers or no presets available"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[400px] p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredPresets.map((preset) => {
                                        const isSelected = selectedItems.find(item => item._id === preset._id);

                                        return (
                                            <div
                                                key={preset._id}
                                                className={`p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => handleToggleSelect(preset)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-gray-800">
                                                                {preset.presetName}
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <p>
                                                                Discount: {preset.discountAmount}
                                                                {preset.discountType === "percentage" ? "%" : "₹"}
                                                            </p>
                                                            {preset.minPurchase && (
                                                                <p>Min purchase: ₹{preset.minPurchase}</p>
                                                            )}
                                                            {preset.usageLimit && (
                                                                <p>Usage limit: {preset.usageLimit}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddSingle(preset);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Add this preset"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>

                                                        <div
                                                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                                                isSelected
                                                                    ? "bg-blue-500 border-blue-500"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="sticky bottom-0 bg-white border-t p-4 rounded-b-2xl flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} available
                                </span>

                                {selectedItems.length > 0 && (
                                    <button
                                        onClick={handleAddSelected}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add {selectedItems.length} Preset{selectedItems.length !== 1 ? 's' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default SpecialOfferPresetSelector;