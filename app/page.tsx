"use client";

import React, { useState } from "react";
import { BibleSearchInput } from "./components/biblia-input";
import { validateBookAndChapter, getVersiculos } from "@/data/biblia";
import { useRouter } from "next/navigation";

export default function Home() {
  const [versiculos, setVersiculos] = useState<string[] | null>(null);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleSearch = (book: string, chapter: string) => {
    setErro("");
    setVersiculos(null);
    const valid = validateBookAndChapter(book, chapter);
    if (!valid) {
      setErro("Livro ou capítulo inválido!");
      return;
    }
    // Navega para a página de visualização do versículo
    router.push(`/biblia/${valid.slug}/${chapter}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        flexDirection: "column",
      }}
    >
      <BibleSearchInput onSearch={handleSearch} />
      {erro && <div className="text-red-500 mt-4">{erro}</div>}
      {/* A visualização dos versículos agora está na página dinâmica */}
    </div>
  );
}
