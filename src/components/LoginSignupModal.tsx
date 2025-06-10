// src/components/LoginSignupModal.tsx
import React from "react";

interface LoginSignupModalProps {
  onClose: () => void;
}

const LoginSignupModal: React.FC<LoginSignupModalProps> = ({ onClose }) => {
  return (
    <>
      {/* screen-dimming overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 pointer-events-none transition-all" />

      {/* modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
          >
            ×
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">
            Offline Mode
          </h2>

          <p className="text-gray-600 text-center mb-4">
            Login is not required in the offline demo version of HoldemTools.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginSignupModal;
