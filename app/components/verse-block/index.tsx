import React from "react";

interface VerseBlockProps {
  number: number;
  text: string;
  comment?: string;
  reference?: string;
}

/**
 * Bloco visual para exibir um versículo, com destaque, comentário e referência.
 * - Usa alto contraste, espaçamento e hierarquia visual.
 * - Comentário e referência são opcionais e aparecem de forma sutil.
 */
export const VerseBlock: React.FC<VerseBlockProps> = ({ number, text, comment, reference }) => (
  <div className="verse-block mb-3">
    <span className="verse-number select-none">{number}</span>
    <span className="text-base leading-relaxed">{text}</span>
    {comment && (
      <div className="footnote mt-2" aria-label="Comentário do versículo">
        {comment}
      </div>
    )}
    {reference && (
      <div className="crossref mt-1" aria-label="Referência cruzada">
        Ver {reference}
      </div>
    )}
  </div>
);