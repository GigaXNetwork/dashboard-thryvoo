import React, { useState } from "react";
import { Trash2, Plus, Tag, Calendar, ShoppingCart, RefreshCw, User, Clock, CheckCircle, Percent, DollarSign, ExternalLink } from "lucide-react";

const SpecialOfferList = ({ items, openModal, onRemoveItem, error }) => {
    const [flippedCard, setFlippedCard] = useState(null);

    const toggleFlip = (itemId) => {
        setFlippedCard(flippedCard === itemId ? null : itemId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDiscountText = (item) => {
        if (item.discountType === 'percentage') {
            return `${item.discountAmount}% OFF`;
        } else if (item.discountType === 'fixed') {
            return `₹${item.discountAmount} OFF`;
        } else if (item.discountType === 'custom') {
            return `${item.discountAmount} OFF`;
        }
        return 'No Discount';
    };

    const getDiscountTypeText = (item) => {
        if (item.discountType === 'percentage') return 'Percentage Discount';
        if (item.discountType === 'fixed') return 'Fixed Amount';
        if (item.discountType === 'custom') return 'Custom Discount';
        return 'Discount';
    };

    const getStatusBadge = (item) => {
        const isExpired = (item.expireAt && new Date(item.expireAt) < new Date());
        if (isExpired) {
            return { text: 'Expired', color: 'bg-red-100 text-red-800 border border-red-200' };
        }
        return item.isActive
            ? { text: 'Active', color: 'bg-white text-green-600 border border-green-600' }
            : { text: 'Inactive', color: 'bg-gray-100 text-gray-800 border border-gray-200' };
    };

    const getTypeBadge = (item) => {
        return item.type === 'cross'
            ? { text: 'Cross', color: 'bg-purple-500' }
            : { text: 'Own', color: 'bg-blue-500' };
    };

    const getDiscountIcon = (item) => {
        if (item.discountType === 'percentage') return <Percent className="w-5 h-5" />;
        if (item.discountType === 'fixed') return <DollarSign className="w-5 h-5" />;
        return <Tag className="w-5 h-5" />;
    };

    const getDiscountGradient = (item) => {
        return item.type === 'cross'
            ? 'bg-gradient-to-br from-purple-500 to-pink-600' // Purple to pink for cross brand
            : 'bg-gradient-to-br from-blue-500 to-indigo-700'; // Blue to indigo for own brand
    };

    const getBackGradient = (item) => {
        return item.type === 'cross'
            ? 'bg-gradient-to-br from-purple-800 to-pink-900' // Dark purple to pink for cross brand
            : 'bg-gradient-to-br from-gray-800 to-gray-900'; // Kept original for own brand
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Tag className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Special Offer Coupons</h2>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {items.length} {items.length === 1 ? 'Coupon' : 'Coupons'}
                        </span>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Add Coupon
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Items Grid */}
            <div className="p-6 min-h-screen">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coupons Added</h3>
                        <p className="text-gray-500 mb-6">Add coupon presets to your special offer to get started.</p>
                        <button
                            onClick={openModal}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Coupon
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {items.map((item) => {
                            const status = getStatusBadge(item);
                            const type = getTypeBadge(item);
                            const isFlipped = flippedCard === item._id;
                            const discountGradient = getDiscountGradient(item);
                            const backGradient = getBackGradient(item);

                            return (
                                <div key={item._id} className="w-full perspective-1000">
                                    {/* Flip Card Container */}
                                    <div
                                        className={`relative w-full h-96 transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
                                            }`}
                                        onClick={() => toggleFlip(item._id)}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Front Face */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-5 flex flex-col border-2"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >

                                            <div className="text-center mb-4 pb-4 border-b-2">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-lg font-bold text-gray-600 mb-1 truncate flex-1 text-left">
                                                        {item.presetName}
                                                    </h2>

                                                    <span className={`${type.color} text-white px-2 py-1 h-6 rounded-full text-xs uppercase`}>
                                                        {type.text} brand 
                                                    </span>

                                                    <span className={`${status.color} px-2 py-1 h-6 rounded-full text-xs uppercase`}>
                                                        {status.text}
                                                    </span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveItem(item._id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors z-10"
                                                        title="Remove from special offer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Main Discount */}
                                            <div className={`${discountGradient} text-white p-4 rounded-xl shadow-lg mb-1 my-4 mx-4`}>
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="text-xl font-bold">{getDiscountText(item)}</div>
                                                    <div className="text-sm opacity-90 mt-1">Special Offer</div>
                                                </div>
                                            </div>

                                            {/* Quick Info */}
                                            <div className="space-y-3 flex-1 flex flex-col justify-center">
                                                {item.minPurchase && (
                                                    <div className="flex flex-col items-center text-center bg-gray-50 px-4 py-3 rounded-lg mx-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <ShoppingCart size={14} className="text-gray-500" />
                                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                                Min Purchase
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-bold text-gray-800">₹{item.minPurchase}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Flip Hint */}
                                            <div className="text-center mt-3 pt-3 text-xs text-gray-400 flex items-center justify-center gap-2 border-t border-gray-200">
                                                <span>Click to see more details</span>
                                                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                                            </div>
                                        </div>

                                        {/* Back Face */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-2xl p-6 flex flex-col border border-gray-200"
                                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                        >

                                            <div className="space-y-3 flex-1 text-sm overflow-y-auto">
                                                {/* Discount Details */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Discount Type</div>
                                                        <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs capitalize">{item.discountType || "--"}</div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Max Discount</div>
                                                        <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs">{item.maxDiscount ? `₹${item.maxDiscount}` : '--'}</div>
                                                    </div>
                                                </div>

                                                {/* Dates */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                            <Tag size={14} />
                                                            Usage Limit
                                                        </div>
                                                        <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs">
                                                            {item.usageLimit !== undefined && item.usageLimit !== null && item.usageLimit !== ""
                                                                ? `${item.usageLimit} Time${item.usageLimit !== 1 ? 's' : ''}`
                                                                : '--'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                            <Clock size={12} /> Expires
                                                        </div>
                                                        <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs">{item.expireAt ? formatDate(item.expireAt) : '--'}</div>
                                                    </div>
                                                </div>

                                                {/* Creation Dates */}
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                        <Calendar size={12} /> Created
                                                    </div>
                                                    <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs">{item.createdAt ? formatDateTime(item.createdAt) : '--'}</div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Last Updated</div>
                                                    <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs">{item.updatedAt ? formatDateTime(item.updatedAt) : '--'}</div>
                                                </div>

                                                {/* Conditions */}
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                                                        Conditions
                                                    </div>
                                                    <div className="bg-gray-300 px-3 py-2 rounded-lg text-xs max-h-20 overflow-y-auto">
                                                        {item.conditions && item.conditions.length > 0 && item.conditions[0] !== "" ? (
                                                            item.conditions.map((condition, index) => (
                                                                <div key={index} className="mb-1 last:mb-0">• {condition}</div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-gray-800">--</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cross Brand Link */}
                                                {item.type === 'cross' && (
                                                    <div className="pt-2">
                                                        {item.link ? (
                                                            <a
                                                                href={item.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 justify-center 
                                                                    bg-gradient-to-r from-purple-600 to-pink-600 
                                                                    hover:from-purple-700 hover:to-pink-700 
                                                                    text-white px-3 py-2 rounded-lg 
                                                                    transition-colors text-sm font-medium shadow-md
                                                            "
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <ExternalLink size={14} />
                                                                Visit Brand Website
                                                            </a>
                                                        ) : (
                                                            <div className="text-center text-xs text-gray-500">No website available</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Back Hint */}
                                            <div className="text-center mt-3 pt-3 text-xs text-gray-500 flex items-center justify-center gap-2 border-t border-gray-700">
                                                <span>Click to go back</span>
                                                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CSS for flip animation */}
            <style>{`
                .perspective-1000 {
                perspective: 1000px;
                }
                .transform-style-3d {
                transform-style: preserve-3d;
                }
                .backface-hidden {
                backface-visibility: hidden;
                }
                .rotate-y-180 {
                transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

export default SpecialOfferList;