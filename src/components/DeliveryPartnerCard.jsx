import React from "react";

const DeliveryPartnerCard = ({ partner }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {partner.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{partner.name}</h4>
            <p className="text-sm text-gray-600">Partner #{partner.id}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            partner.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {partner.isAvailable ? "Available" : "Busy"}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Location:</span>
          <span className="font-medium">Location {partner.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-medium ${
              partner.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {partner.isAvailable ? "Ready for delivery" : "On delivery"}
          </span>
        </div>
      </div>

      {!partner.isAvailable && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Currently delivering order</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnerCard;
