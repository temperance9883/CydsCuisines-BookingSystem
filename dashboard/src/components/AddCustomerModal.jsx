import React from "react";

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  children,
  editMode, // Add this prop to determine if it's in edit mode
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editMode ? "Edit Customer" : "Add Customer"}
        </h2>
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-between mt-4">
            {/* Conditional Cancel Button */}
            {!editMode && (
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 rounded-md p-2 hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            )}
            {/* Conditional Delete and Save Buttons for Edit Mode */}
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={onDelete} // Trigger the delete function passed as prop
                  className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
                >
                  Save
                </button>
              </>
            ) : (
              // Save Button for Add Mode
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
