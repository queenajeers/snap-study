import { ShieldCloseIcon, X } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 text-gray-100 hover:text-gray-300"
          aria-label="Close"
        >
          <X />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
