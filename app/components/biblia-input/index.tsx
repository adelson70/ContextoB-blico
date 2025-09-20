"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

interface BibleSearchInputProps {
  onSearch: (book: string, chapter: string) => void;
}

export const BibleSearchInput: React.FC<BibleSearchInputProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Regex: captura "Livro 3", "Livro", "3"
  const parseInput = (value: string) => {
    const match = value.trim().match(/^([\p{L}\s]+)?\s*(\d+)?$/u);
    if (!match) return { book: "", chapter: "" };
    const book = (match[1] || "").trim();
    const chapter = (match[2] || "").trim();
    return { book, chapter };
  };

  const handleSearch = () => {
    const { book, chapter } = parseInput(input);
    if (!book || !chapter) {
      setError("Digite o nome do livro e o capítulo.");
      return;
    }
    setError("");
    onSearch(book, chapter);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <label
        htmlFor="bible-search"
        className="mb-2 text-base font-medium text-text"
      >
        Pesquisar livro e capítulo
      </label>
      <div className="flex w-full max-w-md">
        <input
          id="bible-search"
          type="text"
          className={`
            flex-1 rounded-2xl bg-background text-text border border-secondary
            shadow-sm focus:outline-none focus:border-primary
            px-4 py-3 text-base transition-colors
            placeholder:text-secondary
          `}
          style={{
            borderColor: "var(--secondary)",
            background: "var(--background)",
            color: "var(--text-color)",
            textAlign: "center",
          }}
          placeholder="Ex: João 3"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Pesquisar livro e capítulo"
        />
        <button
          type="button"
          className={`
            ml-2 flex items-center justify-center rounded-2xl
            bg-primary hover:bg-highlight transition-colors
            text-background px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary
          `}
          style={{
            background: "var(--primary)",
            color: "var(--background)",
          }}
          onClick={handleSearch}
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>
      </div>
      {error && (
        <span className="mt-2 text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
