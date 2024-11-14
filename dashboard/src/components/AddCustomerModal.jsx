// Modal.js
import React from "react";

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add Customer</h2>
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 rounded-md p-2 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
