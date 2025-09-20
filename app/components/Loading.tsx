export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen min-w-full bg-background/90"
      role="status"
      aria-live="polite"
    >
      <div className="book-simple mb-10">
        <svg viewBox="0 0 320 240" className="book-svg" aria-hidden="true">
          {/* Capa */}
          <rect x="10" y="20" width="300" height="180" rx="22" fill="#b8a07a" />
          {/* Página esquerda */}
          <rect x="25" y="32" width="130" height="156" rx="14" fill="#f8f5e8" />
          {/* Página direita */}
          <rect x="165" y="32" width="130" height="156" rx="14" fill="#f8f5e8" />
          {/* Marca página vermelho */}
          <rect x="157" y="20" width="6" height="180" rx="3" fill="#c1121f" />
          <polygon points="160,200 153,220 167,220" fill="#c1121f" />
          {/* Linhas da página esquerda */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="40" y={54 + i * 18} width="100" height="6" rx="3" fill="#e7e2d6" opacity="0.7" />
          ))}
          {/* Linhas da página direita */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="180" y={54 + i * 18} width="100" height="6" rx="3" fill="#e7e2d6" opacity="0.7" />
          ))}
        </svg>
        {/* Lupa animada */}
        <div className="magnifier-simple">
          <svg viewBox="0 0 64 64" className="magnifier-svg" aria-hidden="true">
            <circle cx="28" cy="28" r="18" stroke="#a3865b" strokeWidth="4" fill="#f8f5e8" />
            <rect x="42" y="42" width="14" height="6" rx="3" fill="#a3865b" transform="rotate(45 49 45)" />
          </svg>
        </div>
        <style>{`
          .book-simple {
            position: relative;
            width: 320px;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .book-svg {
            width: 100%;
            height: 100%;
            display: block;
          }
          .magnifier-simple {
            position: absolute;
            left: 132px;
            top: 60px;
            width: 56px;
            height: 56px;
            z-index: 10;
            animation: magnifier-move-simple 2.2s cubic-bezier(.7,.2,.3,1) infinite alternate;
            filter: drop-shadow(0 2px 8px #0003);
          }
          .magnifier-svg {
            width: 56px;
            height: 56px;
            display: block;
          }
          @keyframes magnifier-move-simple {
            0% { left: 132px; top: 60px; }
            30% { left: 160px; top: 80px; }
            60% { left: 180px; top: 110px; }
            80% { left: 160px; top: 130px; }
            100% { left: 132px; top: 60px; }
          }
        `}</style>
      </div>
      <span className="text-text text-2xl font-semibold tracking-wide text-center">Carregando versículos...</span>
    </div>
  );
}
