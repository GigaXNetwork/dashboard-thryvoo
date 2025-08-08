import { X } from 'lucide-react';

export default function PresetForm({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  resetForm,
  loading,
  isEditing
}) {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${showForm ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Create Discount Preset</h2>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 overflow-y-auto h-[calc(100%-64px)]">

        {/* Discount Type Selector */}
        <div className="space-y-1">
          <label htmlFor="discountType" className="text-sm font-medium text-gray-700">
            Discount Type
          </label>
          <select
            id="discountType"
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Preset Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preset Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="own">Own</option>
            <option value="cross">Cross Brand</option>
            <option value="offer">Offer</option>
          </select>
        </div>

        {/* Dynamic Inputs */}
        {[ 
          { label: 'Coupon Name', name: 'presetName', type: 'text' },
          { label: 'Discount Amount/Offer', name: 'discountAmount', type: form.discountType === 'custom' ? 'text' : 'number' },
          ...(form.discountType !== 'custom' ? [
            { label: 'Max Discount', name: 'maxDiscount', type: 'number' }
          ] : []),
          { label: 'Min Purchase', name: 'minPurchase', type: 'number' },
          { label: 'Valid Days', name: 'day', type: 'number' },
          { label: 'Valid Hours', name: 'hour', type: 'number' },
          { label: 'Usage Limit', name: 'usageLimit', type: 'number' }
        ].map(({ label, name, type }) => (
          <div key={name} className="w-full">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              placeholder={`Enter ${label}`}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 shadow-sm"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={resetForm}
            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg py-2.5 transition border border-gray-300 shadow-sm"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition flex items-center justify-center shadow-md"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Coupon' : 'Create Coupon')}
          </button>
        </div>
      </form>
    </div>
  );
}
