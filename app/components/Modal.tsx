"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-background rounded-xl shadow-2xl max-w-lg w-[90vw] p-6 relative animate-fade-in" style={{backgroundColor: 'var(--color-background, #181825)', opacity: 1}}>
        <button
          className="absolute top-3 right-3 text-2xl text-accent-700 hover:text-accent-900 focus:outline-none"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          &times;
        </button>
        {title && (
          <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        )}
        <div className="text-base text-text max-h-[50vh] overflow-y-auto whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
};
