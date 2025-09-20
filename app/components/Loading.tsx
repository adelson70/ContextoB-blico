import React from "react";

/**
 * Componente de loading acessível e minimalista para uso global.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen min-w-full bg-background/90"
      role="status"
      aria-live="polite"
    >
      <svg
        className="animate-spin h-20 w-20 text-accent mb-6 drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6" />
        <path className="opacity-75" fill="currentColor" d="M8 24a16 16 0 0116-16v8a8 8 0 00-8 8H8z" />
      </svg>
      <span className="text-text text-xl font-semibold tracking-wide text-center">Carregando versículos...</span>
    </div>
  );
}
