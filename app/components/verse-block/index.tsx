'use client';

import React, { useState } from "react";
import { Modal } from "../Modal";

interface VerseBlockProps {
  number: number;
  text: string;
  comment?: string;
  reference?: string;
  book: string;
  chapter: string | number;
}

/**
 * Bloco visual para exibir um versículo, com destaque, comentário e referência.
 * - Usa alto contraste, espaçamento e hierarquia visual.
 * - Comentário e referência são opcionais e aparecem de forma sutil.
 */
// ...existing code...
export const VerseBlock: React.FC<VerseBlockProps> = ({ number, text, comment, reference, book, chapter }) => {
  const [showModal, setShowModal] = useState(false);
  const hasComment = !!comment;
  return (
    <>
      <div
        className="verse-block mb-3 cursor-pointer relative group"
        tabIndex={0}
        role="button"
        aria-label={`Versículo ${number}${hasComment ? ', possui comentário' : ''}`}
        onClick={() => hasComment && setShowModal(true)}
        onKeyDown={e => {
          if (hasComment && (e.key === 'Enter' || e.key === ' ')) setShowModal(true);
        }}
      >
        {hasComment && (
          <span
            className="absolute top-2 right-2 text-accent-600 group-hover:scale-110 transition-transform"
            title="Ver comentários deste versículo"
            aria-label="Possui comentário"
          >
            {/* Ícone de balão de comentário */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12c0-3.314 3.582-6 8-6s8 2.686 8 6-3.582 6-8 6c-.7 0-1.38-.06-2.03-.17-.36-.06-.73-.01-1.04.15l-2.13 1.13c-.38.2-.82-.17-.7-.59l.47-1.57c.09-.3.04-.62-.13-.87C4.36 14.5 4 13.28 4 12Z" stroke="currentColor" strokeWidth="2" fill="#fff"/>
              <circle cx="9" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="15" cy="12" r="1" fill="currentColor" />
            </svg>
          </span>
        )}
        <span className="verse-number select-none">{number}</span>
        <span className="text-base leading-relaxed ml-6">{text}</span>
        {reference && (
          <div className="crossref mt-2 text-xs text-accent-700" aria-label="Referência cruzada">
            Ver {reference}
          </div>
        )}
      </div>
      {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${book} ${chapter}:${number}`}>
            {comment}
          </Modal>
      )}
    </>
  );
};