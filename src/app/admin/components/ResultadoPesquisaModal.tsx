"use client";

import React, { useState } from "react";
import { getVersiculos } from "@/src/data/biblia";
import { X, BookOpen } from "lucide-react";

interface ResultadoPesquisaModalProps {
  isOpen: boolean;
  onClose: () => void;
  livro: string;
  capitulo: string;
}

export default function ResultadoPesquisaModal({ isOpen, onClose, livro, capitulo }: ResultadoPesquisaModalProps) {
  const [versiculoSelecionado, setVersiculoSelecionado] = useState<number | null>(null);
  
  if (!isOpen) return null;

  const versiculos = getVersiculos(livro, capitulo);
  const nomeLivro = livro.charAt(0).toUpperCase() + livro.slice(1).replace(/-/g, ' ');

  const handleVersiculoClick = (index: number) => {
    setVersiculoSelecionado(versiculoSelecionado === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-5xl w-[98vw] max-h-[95vh] p-6 relative animate-fade-in overflow-hidden">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none z-10"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {nomeLivro} - Capítulo {capitulo}
            </h2>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] pr-2">
          {versiculos ? (
            <div className="space-y-3">
              {versiculos.map((versiculo, index) => (
                <div key={index}>
                  <div 
                    onClick={() => handleVersiculoClick(index)}
                    className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      versiculoSelecionado === index 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' 
                        : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                      versiculoSelecionado === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {index + 1}
                    </span>
                    <p className={`text-gray-900 dark:text-white leading-relaxed text-lg ${
                      versiculoSelecionado === index ? 'font-medium' : ''
                    }`}>
                      {versiculo}
                    </p>
                  </div>
                  
                  {versiculoSelecionado === index && (
                    <div className="mt-2 ml-14 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                        Detalhes do Versículo {index + 1}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Livro:</strong> {nomeLivro}</p>
                        <p><strong>Capítulo:</strong> {capitulo}</p>
                        <p><strong>Versículo:</strong> {index + 1}</p>
                        <p><strong>Palavras:</strong> {versiculo.split(' ').length}</p>
                        <p><strong>Caracteres:</strong> {versiculo.length}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Não foi possível carregar os versículos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
