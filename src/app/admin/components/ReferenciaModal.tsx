"use client";

import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { livros, getVersiculos } from "@/src/data/biblia";
import { X, Trash2 } from "lucide-react";

// Função para converter slug do livro em nome bonito
const getLivroNome = (livroSlug: string) => {
  const livro = livros.find(l => l.slug === livroSlug);
  return livro ? livro.name : livroSlug;
};

interface ReferenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReferenciaModal({ isOpen, onClose, onSuccess }: ReferenciaModalProps) {
  const [livroSelecionado, setLivroSelecionado] = useState<any>(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState<any>(null);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState<any>(null);
  const [referencias, setReferencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReferencias, setLoadingReferencias] = useState(false);
  const [modoDelecao, setModoDelecao] = useState(false);
  const [referenciasSelecionadas, setReferenciasSelecionadas] = useState<number[]>([]);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarAdicao, setMostrarAdicao] = useState(false);
  const [versiculoBase, setVersiculoBase] = useState<any>(null);
  const [referenciaParaAdicionar, setReferenciaParaAdicionar] = useState<any>(null);
  
  // Estados para os selects de referência
  const [livroReferencia, setLivroReferencia] = useState<any>(null);
  const [capituloReferencia, setCapituloReferencia] = useState<any>(null);
  const [versiculoReferencia, setVersiculoReferencia] = useState<any>(null);

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

  // Opções para os selects de referência
  const opcoesLivrosReferencia = useMemo(() => 
    livros.map(livro => ({
      value: livro.slug,
      label: livro.name
    }))
  , []);

  const opcoesCapitulosReferencia = useMemo(() => {
    console.log('Calculando opções de capítulos para referência, livroReferencia:', livroReferencia);
    if (!livroReferencia) return [];
    const livro = livros.find(l => l.slug === livroReferencia.value);
    console.log('Livro encontrado:', livro);
    if (!livro) return [];
    const capitulos = Array.from({ length: livro.cap }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Capítulo ${i + 1}`
    }));
    console.log('Capítulos gerados:', capitulos);
    return capitulos;
  }, [livroReferencia]);

  const opcoesVersiculosReferencia = useMemo(() => {
    if (!livroReferencia || !capituloReferencia) return [];
    const versiculos = getVersiculos(livroReferencia.value, capituloReferencia.value);
    if (!versiculos) return [];
    
    return versiculos.map((versiculo, index) => ({
      value: (index + 1).toString(),
      label: `${index + 1}. ${versiculo.substring(0, 50)}${versiculo.length > 50 ? '...' : ''}`
    }));
  }, [livroReferencia, capituloReferencia]);

  // Bloquear scroll da página quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll quando componente for desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Carregar referências existentes quando o versículo for selecionado
  useEffect(() => {
    const carregarReferencias = async () => {
      if (!livroSelecionado || !capituloSelecionado || !versiculoSelecionado) {
        setReferencias([]);
        return;
      }

      setLoadingReferencias(true);
      try {
        const response = await fetch(`/api/referencias?livroSlug=${livroSelecionado.value}&capitulo=${capituloSelecionado.value}&versiculo=${versiculoSelecionado.value}`);
        if (response.ok) {
          const refs = await response.json();
          setReferencias(refs);
        } else {
          console.error("Erro ao carregar referências");
          setReferencias([]);
        }
      } catch (error) {
        console.error("Erro ao carregar referências:", error);
        setReferencias([]);
      } finally {
        setLoadingReferencias(false);
      }
    };

    carregarReferencias();
  }, [livroSelecionado, capituloSelecionado, versiculoSelecionado]);

  const adicionarReferencia = async () => {
    if (!livroSelecionado || !capituloSelecionado || !versiculoSelecionado) {
      alert("Por favor, selecione livro, capítulo e versículo");
      return;
    }

    setLoading(true);
    try {
      const versiculoTexto = versiculoSelecionado.label.split('. ')[1] || versiculoSelecionado.label;
      
      await createReferencia({
        livroSlug: livroSelecionado.value,
        capitulo: parseInt(capituloSelecionado.value),
        versiculo: parseInt(versiculoSelecionado.value),
        referencia: versiculoTexto
      });

      // Recarregar a lista de referências
      const response = await fetch(`/api/referencias?livroSlug=${livroSelecionado.value}&capitulo=${capituloSelecionado.value}&versiculo=${versiculoSelecionado.value}`);
      if (response.ok) {
        const refs = await response.json();
        setReferencias(refs);
      }

      setLivroSelecionado(null);
      setCapituloSelecionado(null);
      setVersiculoSelecionado(null);
    } catch (error) {
      console.error("Erro ao adicionar referência:", error);
      alert("Erro ao adicionar referência");
    } finally {
      setLoading(false);
    }
  };

  const prepararAdicaoReferencia = () => {
    if (!livroSelecionado || !capituloSelecionado || !versiculoSelecionado) {
      alert("Por favor, selecione livro, capítulo e versículo base");
      return;
    }

    const versiculos = getVersiculos(livroSelecionado.value, capituloSelecionado.value);
    if (!versiculos) {
      alert("Versículo não encontrado");
      return;
    }

    const versiculoTexto = versiculos[parseInt(versiculoSelecionado.value) - 1];
    setVersiculoBase({
      livro: livroSelecionado.label,
      livroSlug: livroSelecionado.value,
      capitulo: parseInt(capituloSelecionado.value),
      versiculo: parseInt(versiculoSelecionado.value),
      texto: versiculoTexto
    });
    setMostrarAdicao(true);
  };

  const prepararReferenciaParaAdicionar = () => {
    if (!livroReferencia || !capituloReferencia || !versiculoReferencia) {
      alert("Por favor, selecione livro, capítulo e versículo da referência");
      return;
    }

    const versiculos = getVersiculos(livroReferencia.value, capituloReferencia.value);
    if (!versiculos) {
      alert("Versículo não encontrado");
      return;
    }

    const versiculoTexto = versiculos[parseInt(versiculoReferencia.value) - 1];
    setReferenciaParaAdicionar({
      livro: livroReferencia.label,
      livroSlug: livroReferencia.value,
      capitulo: parseInt(capituloReferencia.value),
      versiculo: parseInt(versiculoReferencia.value),
      texto: versiculoTexto
    });
  };

  const adicionarReferenciaPreparada = async () => {
    if (!versiculoBase || !referenciaParaAdicionar) {
      alert("Por favor, selecione a referência bíblica");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/referencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          livroSlug: versiculoBase.livroSlug,
          capitulo: versiculoBase.capitulo,
          versiculo: versiculoBase.versiculo,
          referencia: `${referenciaParaAdicionar.livro} ${referenciaParaAdicionar.capitulo}:${referenciaParaAdicionar.versiculo}`
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar referência');
      }

      // Recarregar a lista de referências
      const refsResponse = await fetch(`/api/referencias?livroSlug=${versiculoBase.livroSlug}&capitulo=${versiculoBase.capitulo}&versiculo=${versiculoBase.versiculo}`);
      if (refsResponse.ok) {
        const refs = await refsResponse.json();
        setReferencias(refs);
      }

      // Limpar estados
      setReferenciaParaAdicionar(null);
      setLivroReferencia(null);
      setCapituloReferencia(null);
      setVersiculoReferencia(null);
      setMostrarAdicao(false);
    } catch (error) {
      console.error("Erro ao adicionar referência:", error);
      alert("Erro ao adicionar referência");
    } finally {
      setLoading(false);
    }
  };


  const deletarReferencia = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta referência?")) {
      return;
    }

    try {
      const response = await fetch(`/api/referencias?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Recarregar a lista de referências
        if (livroSelecionado && capituloSelecionado && versiculoSelecionado) {
          const refsResponse = await fetch(`/api/referencias?livroSlug=${livroSelecionado.value}&capitulo=${capituloSelecionado.value}&versiculo=${versiculoSelecionado.value}`);
          if (refsResponse.ok) {
            const refs = await refsResponse.json();
            setReferencias(refs);
          }
        }
        alert("Referência deletada com sucesso!");
      } else {
        alert("Erro ao deletar referência");
      }
    } catch (error) {
      console.error("Erro ao deletar referência:", error);
      alert("Erro ao deletar referência");
    }
  };

  const toggleModoDelecao = () => {
    setModoDelecao(!modoDelecao);
    setReferenciasSelecionadas([]);
    setMostrarConfirmacao(false);
  };

  const toggleSelecaoReferencia = (id: number) => {
    if (referenciasSelecionadas.includes(id)) {
      setReferenciasSelecionadas(referenciasSelecionadas.filter(refId => refId !== id));
    } else {
      setReferenciasSelecionadas([...referenciasSelecionadas, id]);
    }
  };

  const confirmarDelecaoEmMassa = async () => {
    if (referenciasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma referência para deletar");
      return;
    }

    setLoading(true);
    try {
      // Deletar todas as referências selecionadas
      const promises = referenciasSelecionadas.map(id => 
        fetch(`/api/referencias?id=${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);

      // Recarregar a lista de referências
      if (livroSelecionado && capituloSelecionado && versiculoSelecionado) {
        const refsResponse = await fetch(`/api/referencias?livroSlug=${livroSelecionado.value}&capitulo=${capituloSelecionado.value}&versiculo=${versiculoSelecionado.value}`);
        if (refsResponse.ok) {
          const refs = await refsResponse.json();
          setReferencias(refs);
        }
      }

      alert(`${referenciasSelecionadas.length} referência(s) deletada(s) com sucesso!`);
      setModoDelecao(false);
      setReferenciasSelecionadas([]);
      setMostrarConfirmacao(false);
    } catch (error) {
      console.error("Erro ao deletar referências:", error);
      alert("Erro ao deletar referências");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReferencias([]);
    setLivroSelecionado(null);
    setCapituloSelecionado(null);
    setVersiculoSelecionado(null);
    setModoDelecao(false);
    setReferenciasSelecionadas([]);
    setMostrarConfirmacao(false);
    setMostrarAdicao(false);
    setVersiculoBase(null);
    setReferenciaParaAdicionar(null);
    setLivroReferencia(null);
    setCapituloReferencia(null);
    setVersiculoReferencia(null);
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

  const handleLivroReferenciaChange = (selectedOption: any) => {
    console.log('Livro referência selecionado:', selectedOption);
    setLivroReferencia(selectedOption);
    setCapituloReferencia(null);
    setVersiculoReferencia(null);
  };

  const handleCapituloReferenciaChange = (selectedOption: any) => {
    setCapituloReferencia(selectedOption);
    setVersiculoReferencia(null);
  };

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
      zIndex: 99999,
      position: 'absolute'
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 99999
    })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40" role="dialog" aria-modal="true">
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-7xl w-[98vw] my-8 relative animate-fade-in ${
          livroSelecionado && capituloSelecionado && versiculoSelecionado 
            ? 'max-h-[90vh]' 
            : 'max-h-[80vh]'
        }`}>
          <div className={`p-8 ${
            livroSelecionado && capituloSelecionado && versiculoSelecionado 
              ? 'max-h-[90vh] overflow-y-auto pr-4' 
              : 'overflow-hidden'
          }`}>
        <button
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none z-10"
          aria-label="Fechar modal"
          onClick={handleClose}
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Adicionar Referência Bíblica
        </h2>
        
        <div className="space-y-8">
          {/* Seleção de Referência */}
          <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Adicionar Referência Bíblica
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
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
                    menuPortalTarget={document.body}
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
                    menuPortalTarget={document.body}
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
                    menuPortalTarget={document.body}
                  />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={prepararAdicaoReferencia}
                disabled={!livroSelecionado || !capituloSelecionado || !versiculoSelecionado}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Adicionar Referência
              </button>
              
              <button
                onClick={toggleModoDelecao}
                disabled={referencias.length === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  modoDelecao 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {modoDelecao ? 'Cancelar Deleção' : 'Deletar Referências'}
              </button>
            </div>
          </div>

          {/* Seção de Adição de Referência */}
          {mostrarAdicao && versiculoBase && (
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Adicionar Referência Bíblica
              </h3>
              
              {/* Versículo Base */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Versículo Base: {versiculoBase.livro} {versiculoBase.capitulo}:{versiculoBase.versiculo}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {versiculoBase.texto}
                </p>
              </div>

              {/* Seleção da Referência Bíblica */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                  Selecionar Referência Bíblica
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Livro da Referência
                    </label>
                    <Select
                      value={livroReferencia}
                      onChange={handleLivroReferenciaChange}
                      options={opcoesLivrosReferencia}
                      placeholder="Buscar livro..."
                      isSearchable
                      styles={customStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capítulo
                    </label>
                    <Select
                      value={capituloReferencia}
                      onChange={handleCapituloReferenciaChange}
                      options={opcoesCapitulosReferencia}
                      placeholder="Selecione o capítulo"
                      isDisabled={!livroReferencia}
                      isSearchable
                      styles={customStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Versículo
                    </label>
                    <Select
                      value={versiculoReferencia}
                      onChange={(selectedOption) => setVersiculoReferencia(selectedOption)}
                      options={opcoesVersiculosReferencia}
                      placeholder="Selecione o versículo"
                      isDisabled={!capituloReferencia}
                      isSearchable
                      styles={customStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prepararReferenciaParaAdicionar}
                    disabled={!livroReferencia || !capituloReferencia || !versiculoReferencia}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Preparar Referência
                  </button>
                </div>
              </div>

              {/* Preview da Referência */}
              {referenciaParaAdicionar && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-100 mb-2">
                    Referência Selecionada: {referenciaParaAdicionar.livro} {referenciaParaAdicionar.capitulo}:{referenciaParaAdicionar.versiculo}
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-4 leading-relaxed">
                    {referenciaParaAdicionar.texto}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={adicionarReferenciaPreparada}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Adicionando...' : 'Confirmar Adição'}
                    </button>
                    <button
                      onClick={() => {
                        setReferenciaParaAdicionar(null);
                        setLivroReferencia(null);
                        setCapituloReferencia(null);
                        setVersiculoReferencia(null);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Limpar Seleção
                    </button>
                  </div>
                </div>
              )}

              {/* Botão Cancelar */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setMostrarAdicao(false);
                    setVersiculoBase(null);
                    setReferenciaParaAdicionar(null);
                    setLivroReferencia(null);
                    setCapituloReferencia(null);
                    setVersiculoReferencia(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Referências */}
          {livroSelecionado && capituloSelecionado && versiculoSelecionado && (
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Referências em {livroSelecionado.label} {capituloSelecionado.value}:{versiculoSelecionado.value}
                {loadingReferencias && <span className="text-sm text-gray-500 ml-2">(Carregando...)</span>}
              </h3>
              
              <div className="max-h-96 overflow-y-auto">
                {loadingReferencias ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Carregando referências...
                  </div>
                ) : referencias.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhuma referência neste capítulo
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {referencias.map((ref) => (
                        <div
                          key={ref.id}
                          onClick={() => modoDelecao && toggleSelecaoReferencia(ref.id)}
                          className={`inline-flex items-center rounded-lg px-3 py-1.5 transition-all duration-200 w-fit cursor-pointer ${
                            modoDelecao
                              ? referenciasSelecionadas.includes(ref.id)
                                ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-400'
                                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                          }`}
                        >
                          {modoDelecao && (
                            <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                              referenciasSelecionadas.includes(ref.id)
                                ? 'bg-red-500 border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {referenciasSelecionadas.includes(ref.id) && (
                                <X className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>
                          )}
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100 whitespace-nowrap">
                            {ref.referencia}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {modoDelecao && referenciasSelecionadas.length > 0 && (
                      <div className="mt-4 flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                        <span className="text-sm text-red-700 dark:text-red-300">
                          {referenciasSelecionadas.length} referência(s) selecionada(s)
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMostrarConfirmacao(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Deletar Selecionadas
                          </button>
                          <button
                            onClick={() => setReferenciasSelecionadas([])}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Limpar Seleção
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Fechar
            </button>
          </div>
          </div>
        </div>

      {/* Modal de Confirmação de Deleção */}
      {mostrarConfirmacao && (
        <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar Deleção
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tem certeza que deseja deletar {referenciasSelecionadas.length} referência(s) selecionada(s)? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarConfirmacao(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelecaoEmMassa}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
