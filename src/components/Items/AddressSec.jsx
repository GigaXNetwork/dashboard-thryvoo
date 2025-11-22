import { MapPin } from "lucide-react";
import { Edit } from "lucide-react";

export default function AddressSec({ cardData, openModal, isExpanded = false }) {
  const addressLine = cardData?.addressLine || "--";
  const city = cardData?.city || "--";
  const state = cardData?.state || "--";
  const country = cardData?.country || "--";
  const pinCode = cardData?.pinCode || "--";
  const longitude = cardData?.longitude || "--";
  const latitude = cardData?.latitude || "--";

  const renderRow = (label, value, field) => (
    <div
      key={field}
      className="flex items-center justify-between py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-3"
    >
      <div className="flex-1 flex items-center gap-6">
        <span className="text-gray-600 font-medium min-w-[120px]">{label}</span>
        <span className="text-gray-800 flex-1 truncate break-all">
          {value}
        </span>
      </div>
      {/* <button
        onClick={() => openModal(field, label)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title={`Edit ${label}`}
      >
        <Edit className="w-4 h-4" />
      </button> */}
    </div>
  );

  return (
    <div className="w-full">
      <div className="space-y-1">
        {renderRow("Address Line", addressLine, "addressLine")}
        {renderRow("City", city, "city")}
        {renderRow("State", state, "state")}
        {renderRow("Country", country, "country")}
        {renderRow("Pin Code", pinCode, "pinCode")}
        {renderRow("Longitude", longitude, "longitude")}
        {renderRow("Latitude", latitude, "latitude")}
      </div>
    </div>
  );
}