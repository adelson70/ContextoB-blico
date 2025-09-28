"use client";


import React, { useState } from "react";
import { BibleSearchInput } from "./components/biblia-input";
import { validateBookAndChapter } from "@/src/data/biblia";
import { useRouter } from "next/navigation";

// Página principal com fundo gradiente sofisticado e centralização
export default function Home() {
  const [erro, setErro] = useState("");
  const router = useRouter();

  // Handler de busca, com feedback de erro acessível
  const handleSearch = (book: string, chapter: string) => {
    setErro("");
    const valid = validateBookAndChapter(book, chapter);
    if (!valid) {
      setErro("Livro ou capítulo inválido!");
      return;
    }
    router.push(`/biblia/${valid.slug}/${chapter}`);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#16203a] via-[#0F172A] to-[#1a1a1a] relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(250,204,21,0.08) 0%, transparent 100%)," +
            "radial-gradient(ellipse 40% 20% at 20% 80%, rgba(56,189,248,0.10) 0%, transparent 100%)"
        }}
      />

        <BibleSearchInput onSearch={handleSearch} />

        {erro && (
          <div
            className="mt-3 text-sm text-red-500 font-medium w-full text-center"
            role="alert"
            aria-live="polite"
          >
            {erro}
          </div>
        )}
    </main>
  );
}
