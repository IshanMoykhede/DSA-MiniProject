import React from "react";

const OrderCard = ({
  order,
  assignment,
  onViewRoute,
  isSelected,
  showPriority = false,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 transition-all duration-200 ${
        isSelected
          ? "border-orange-500 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
          <p className="text-sm text-gray-600">{order.customerName}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Restaurant:</span>
          <span className="font-medium">{order.restaurant}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Value:</span>
          <span className="font-medium">₹{order.orderValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery to:</span>
          <span className="font-medium">Location {order.deliveryLocation}</span>
        </div>
        {order.priority && (
          <div className="flex justify-between">
            <span className="text-gray-600">Priority:</span>
            <span className="font-medium text-orange-600">
              {order.priority.toFixed(2)}
            </span>
          </div>
        )}
        {showPriority && order.priorityScore !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Priority Score:</span>
            <span className="font-medium text-purple-600">
              {order.priorityScore.toFixed(4)}
            </span>
          </div>
        )}
        {showPriority && order.actualDistance !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium text-gray-700">
              {order.actualDistance} units
            </span>
          </div>
        )}
      </div>

      {assignment && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Partner:</span>
              <span className="font-medium text-blue-600">
                {assignment.partnerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Distance:</span>
              <span className="font-medium">{assignment.totalDistance} km</span>
            </div>
          </div>

          <button
            onClick={() => onViewRoute(assignment)}
            className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View Route on Map
          </button>
        </div>
      )}

      {order.status === "assigned" && assignment && (
        <button
          onClick={() => {
            // Don't mutate the order directly, just call the update function
            if (window.updateOrderStatus) {
              window.updateOrderStatus(order.id, "out_for_delivery");
            }
          }}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Start Delivery
        </button>
      )}

      {order.status === "out_for_delivery" && assignment && (
        <button
          onClick={() => {
            if (window.completeDelivery) {
              window.completeDelivery(assignment);
            }
          }}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Mark as Delivered
        </button>
      )}
    </div>
  );
};

export default OrderCard;
