import { X } from 'lucide-react';

const CouponDetails = ({
  name,
  number,
  email,
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
  createdAt,
  setShowReviewCard,
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-6 sm:p-8 border-b border-gray-100">
          <button
            onClick={() => setShowReviewCard(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            🎁 Coupon Details
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 sm:px-8 py-4 space-y-4 text-sm sm:text-base text-gray-700">
          <Detail label="Name" value={name} />
          <Detail label="Number" value={number} />
          <Detail label="Email" value={email} />
          <Detail label="Review" value={review} />
          <Detail label="Rating" value={<span className="text-yellow-500">⭐ {rating}</span>} />
          <Detail
            label="Code"
            value={
              <span className="font-mono bg-blue-100 text-blue-700 px-3 py-1 rounded-lg tracking-wider">
                {code}
              </span>
            }
          />
          <Detail label="Discount Type" value={discountType} />
          <Detail label="Discount Amount" value={`💸 ${discountAmount}`} />
          <Detail label="Max Discount" value={maxDiscount ?? 'N/A'} />
          <Detail label="Min Purchase" value={minPurchase} />
          <Detail label="Created At" value={new Date(createdAt).toLocaleDateString()} />
          <Detail label="Expiration Date" value={new Date(expirationDate).toLocaleDateString()} />
          <Detail label="Usage Limit" value={usageLimit} />
          <Detail label="Usage Count" value={usageCount} />
          <Detail label="Status" value={<StatusPill status={status} />} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white px-6 sm:px-8 py-4 border-t border-gray-100 text-center">
          <button
            onClick={() => setShowReviewCard(false)}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => {
  const displayValue = label === 'Discount Type' || label === "Name"
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value;

  return (
    <div className="flex justify-between items-start border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-600 w-1/2 text-left">{label}:</span>
      <span className="text-right w-1/2 text-gray-800 break-words">{displayValue}</span>
    </div>
  );
};



const StatusPill = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  const statusStyles =
    normalizedStatus === 'active'
      ? 'bg-green-100 text-green-700'
      : normalizedStatus === 'redeemed'
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles}`}>
      {status}
    </span>
  );
};

export default CouponDetails;
