import { X } from 'lucide-react';

const CouponDetails = ({
  review,
  rating,
  code,
  discountType,
  discountAmount,
  maxDiscount,
  minPurchase,
  expirationDate,
  usageLimit,
  usageCount,
  status,
  setShowReviewCard,
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-800 to-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl border border-gray-200">
        {/* Close Button */}
        <button
          onClick={() => setShowReviewCard(false)}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={24} />
        </button>

        <h2 className="mb-8 text-3xl font-extrabold text-gray-800 text-center">🎁 Coupon Details</h2>

        <div className="grid grid-cols-1 gap-5 text-sm text-gray-700">
          <Detail label="Review" value={review} />
          <Detail label="Rating" value={<span className="text-yellow-500">⭐ {rating}</span>} />
          <Detail
            label="Code"
            value={<span className="font-mono bg-blue-100 text-blue-700 px-3 py-1 rounded-lg tracking-widest shadow-sm">{code}</span>}
          />
          <Detail label="Discount Type" value={discountType} />
          <Detail label="Discount Amount" value={`💸 ${discountAmount}`} />
          <Detail label="Max Discount" value={maxDiscount ?? 'N/A'} />
          <Detail label="Min Purchase" value={minPurchase} />
          <Detail label="Expiration Date" value={new Date(expirationDate).toLocaleDateString()} />
          <Detail label="Usage Limit" value={usageLimit} />
          <Detail label="Usage Count" value={usageCount} />
          <Detail
            label="Status"
            value={
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                  status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {status}
              </span>
            }
          />
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setShowReviewCard(false)}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 text-white text-sm font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
    <span className="font-semibold text-gray-600 w-1/2">{label}:</span>
    <span className="text-right text-gray-800 w-1/2 break-words">{value}</span>
  </div>
);

export default CouponDetails;