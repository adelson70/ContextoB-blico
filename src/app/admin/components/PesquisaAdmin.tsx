"use client";

import React, { useState } from "react";
import Select from "react-select";
import { livros } from "@/src/data/biblia";
import ResultadoPesquisaModal from "./ResultadoPesquisaModal";

export default function PesquisaAdmin() {
  const [livroSelecionado, setLivroSelecionado] = useState<any>(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isResultadoModalOpen, setIsResultadoModalOpen] = useState(false);

  const opcoesLivros = livros.map(livro => ({
    value: livro.slug,
    label: livro.name
  }));

  const opcoesCapitulos = livroSelecionado 
    ? Array.from({ length: livros.find(l => l.slug === livroSelecionado.value)?.cap || 0 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Capítulo ${i + 1}`
      }))
    : [];

  const handlePesquisar = async () => {
    if (!livroSelecionado || !capituloSelecionado) {
      alert("Por favor, selecione um livro e capítulo");
      return;
    }

    setLoading(true);
    try {
      // Abrir modal com resultado
      setIsResultadoModalOpen(true);
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
      alert("Erro ao pesquisar");
    } finally {
      setLoading(false);
    }
  };

  const handleLivroChange = (selectedOption: any) => {
    setLivroSelecionado(selectedOption);
    setCapituloSelecionado(null);
  };

  const handleCapituloChange = (selectedOption: any) => {
    setCapituloSelecionado(selectedOption);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'white',
      border: 'none',
      boxShadow: 'none',
      minHeight: '36px',
      height: '36px',
      '&:hover': {
        border: 'none'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#dbeafe'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    })
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Pesquisa Bíblica (Admin)
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 text-center">
          Esta pesquisa não será contabilizada nas estatísticas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Livro
            </label>
            <Select
              value={livroSelecionado}
              onChange={handleLivroChange}
              options={opcoesLivros}
              placeholder="Buscar livro..."
              isSearchable
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capítulo
            </label>
            <Select
              value={capituloSelecionado}
              onChange={handleCapituloChange}
              options={opcoesCapitulos}
              placeholder="Selecione o capítulo"
              isDisabled={!livroSelecionado}
              isSearchable
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePesquisar}
              disabled={loading || !livroSelecionado || !capituloSelecionado}
              className="w-full px-4 h-9 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pesquisando...
                </>
              ) : (
                "Pesquisar"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      <ResultadoPesquisaModal
        isOpen={isResultadoModalOpen}
        onClose={() => setIsResultadoModalOpen(false)}
        livro={livroSelecionado?.value || ""}
        capitulo={capituloSelecionado?.value || ""}
      />
    </>
  );
}
