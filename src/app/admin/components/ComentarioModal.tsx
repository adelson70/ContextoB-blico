"use client";

import React, { useState, useMemo } from "react";
import Select from "react-select";
import { livros, getVersiculos } from "@/src/data/biblia";
import { createComentario } from "@/src/services/comentarioService";

interface ComentarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ComentarioModal({ isOpen, onClose, onSuccess }: ComentarioModalProps) {
  const [livroSelecionado, setLivroSelecionado] = useState<any>(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState<any>(null);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState<any>(null);
  const [texto, setTexto] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const opcoesLivros = useMemo(() => 
    livros.map(livro => ({
      value: livro.slug,
      label: livro.name
    })), []
  );

  const opcoesCapitulos = useMemo(() => {
    if (!livroSelecionado) return [];
    const livro = livros.find(l => l.slug === livroSelecionado.value);
    if (!livro) return [];
    
    return Array.from({ length: livro.cap }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Capítulo ${i + 1}`
    }));
  }, [livroSelecionado]);

  const opcoesVersiculos = useMemo(() => {
    if (!livroSelecionado || !capituloSelecionado) return [];
    const versiculos = getVersiculos(livroSelecionado.value, capituloSelecionado.value);
    if (!versiculos) return [];
    
    return versiculos.map((versiculo, index) => ({
      value: (index + 1).toString(),
      label: `${index + 1}. ${versiculo.substring(0, 50)}${versiculo.length > 50 ? '...' : ''}`
    }));
  }, [livroSelecionado, capituloSelecionado]);

  const handleSubmit = async () => {
    if (!livroSelecionado || !capituloSelecionado || !versiculoSelecionado || !texto.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await createComentario({
        livroSlug: livroSelecionado.value,
        capitulo: parseInt(capituloSelecionado.value),
        versiculo: parseInt(versiculoSelecionado.value),
        texto: texto.trim()
      });
      
      // Limpar formulário
      setLivroSelecionado(null);
      setCapituloSelecionado(null);
      setVersiculoSelecionado(null);
      setTexto("");
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      alert("Erro ao criar comentário");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLivroSelecionado(null);
    setCapituloSelecionado(null);
    setVersiculoSelecionado(null);
    setTexto("");
    onClose();
  };

  const handleLivroChange = (selectedOption: any) => {
    setLivroSelecionado(selectedOption);
    setCapituloSelecionado(null);
    setVersiculoSelecionado(null);
  };

  const handleCapituloChange = (selectedOption: any) => {
    setCapituloSelecionado(selectedOption);
    setVersiculoSelecionado(null);
  };

  if (!isOpen) return null;

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
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
      zIndex: 9999
    })
  };

  const darkCustomStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#1e293b',
      borderColor: state.isFocused ? '#3b82f6' : '#475569',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      color: 'white',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#334155' : '#1e293b',
      color: state.isSelected ? 'white' : '#e2e8f0',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#334155'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1e293b',
      zIndex: 9999
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-[98vw] max-h-[95vh] p-8 relative animate-fade-in overflow-hidden">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none z-10"
          aria-label="Fechar modal"
          onClick={handleClose}
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Adicionar Comentário
        </h2>
        
        <div className="space-y-8 overflow-y-auto max-h-[calc(95vh-140px)] pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
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

            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Versículo
              </label>
              <Select
                value={versiculoSelecionado}
                onChange={(selectedOption) => setVersiculoSelecionado(selectedOption)}
                options={opcoesVersiculos}
                placeholder="Selecione o versículo"
                isDisabled={!capituloSelecionado}
                isSearchable
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comentário
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite o comentário para este versículo..."
              rows={8}
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white resize-vertical"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !livroSelecionado || !capituloSelecionado || !versiculoSelecionado || !texto.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              "Salvar Comentário"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
