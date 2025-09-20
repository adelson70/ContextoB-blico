"use client";


import React, { useState } from "react";
import { BibleSearchInput } from "./components/biblia-input";
import { validateBookAndChapter } from "@/data/biblia";
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
    // Layout flex-col, centralização vertical, fundo noturno com gradiente sutil
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#16203a] via-[#0F172A] to-[#1a1a1a] relative overflow-hidden">
      {/* Toque espiritual: gradientes radiais suaves, sem exagero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(250,204,21,0.08) 0%, transparent 100%)," +
            "radial-gradient(ellipse 40% 20% at 20% 80%, rgba(56,189,248,0.10) 0%, transparent 100%)"
        }}
      />

      {/* Container centralizado, com backdrop-blur para foco no input */}
      <section
        className="z-10 flex flex-col items-center justify-center w-full max-w-lg px-4 py-12 rounded-2xl bg-[rgba(15,23,42,0.85)] shadow-xl backdrop-blur-md"
        aria-label="Busca bíblica"
      >
        {/* Título minimalista */}
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 tracking-tight select-none">
          Contexto Bíblico
        </h1>
        {/* Subtítulo sutil */}
        <h2 className="text-lg md:text-xl font-medium text-neutral-light mb-8 select-none">
          Estudo, leitura e pesquisa das Escrituras
        </h2>

        {/* Input de busca centralizado, elegante e acessível */}
        <BibleSearchInput onSearch={handleSearch} />

        {/* Feedback de erro acessível */}
        {erro && (
          <div
            className="mt-3 text-sm text-red-500 font-medium w-full text-center"
            role="alert"
            aria-live="polite"
          >
            {erro}
          </div>
        )}

        {/* Texto de apoio convidativo */}
        <p className="mt-8 text-base text-neutral-light text-center max-w-md select-none">
          Digite o nome do livro e o capítulo para começar sua pesquisa e aprofundar seu estudo bíblico.
        </p>
      </section>
    </main>
  );
}
