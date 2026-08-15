import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={`bg-dark border border-white/10 rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-slideUp`}>
        {children}
      </div>
    </div>
  );
};
