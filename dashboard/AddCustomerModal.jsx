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
      <div className="bg-white rounded-lg p-5 w-1/3"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("/goldpaper.jpg")`, // Correctly references the image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      >
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
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
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
                  className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Delete
                </button>
                
                <button
                  type="submit"
                  className="mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-300"
                >
                  Save
                </button>
              </>
            ) : (
              // Save Button for Add Mode
              <button
                type="submit"
                className="mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-300"
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
