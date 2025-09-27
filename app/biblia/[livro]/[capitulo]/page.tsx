import { pesquisaBiblica } from '@/services/pesquisaBiblica';
import { headers } from 'next/headers';
import { getVersiculos, validateBookAndChapter, getReferencias, getComentario, getPreviousChapter, getNextChapter, getMenuPath } from '@/data/biblia';
import { ArrowLeft, ArrowRight, HomeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { VerseBlock } from '@components/verse-block/index';

interface BibliaPageProps {
  params: { livro: string; capitulo: string };
}



export default async function BibliaDisplayPage({ params }: BibliaPageProps) {
  const { livro, capitulo } = await params;

  const ip = (await headers()).get('x-client-ip') || 'anonimo'

  pesquisaBiblica(livro, capitulo, ip)

  const valid = validateBookAndChapter(livro, capitulo);
  if (!valid) return notFound();
  const versiculos = getVersiculos(valid.slug, capitulo);
  if (!versiculos) return notFound();

  // Busca comentários e referências de todos os versículos em paralelo
  const comentarios = await Promise.all(
    versiculos.map((_, i) => getComentario(valid.slug, String(valid.capitulo), String(i + 1)))
  );
  const referencias = await Promise.all(
    versiculos.map((_, i) => getReferencias(valid.slug, String(valid.capitulo), String(i + 1)))
  );

  // Navegação
  const prev = getPreviousChapter(valid.slug, valid.capitulo);
  const next = getNextChapter(valid.slug, valid.capitulo);
  const menuPath = getMenuPath();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-6 tracking-tight text-center">
        {valid.nomeBonito?.toUpperCase() || valid.slug.toUpperCase()} {capitulo}
      </h1>

      <nav className="flex gap-3 mb-8" aria-label="Navegação de capítulos">
        <a
          href={prev ? `/biblia/${prev.slug}/${prev.capitulo}` : menuPath}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/90 text-accent-foreground font-semibold shadow transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent-foreground focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
          aria-label="Capítulo anterior"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
        </a>
        <a
          href={menuPath}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Voltar para o menu principal"
        >
          <HomeIcon className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Inicio</span>
        </a>
        <a
          href={next ? `/biblia/${next.slug}/${next.capitulo}` : menuPath}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/90 text-accent-foreground font-semibold shadow transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent-foreground focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
          aria-label="Próximo capítulo"
        >
          <span className="hidden sm:inline">Próximo</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </a>
      </nav>

      <div
        className="w-full bg-background/80 rounded-xl p-4 shadow-lg grid gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}
      >
        {versiculos.map((v, i) => (
          <VerseBlock
            key={i}
            number={i + 1}
            text={v}
            comment={comentarios[i] || undefined}
            reference={referencias[i] ? referencias[i]?.join('; ') : undefined}
            book={valid.nomeBonito || valid.slug}
            chapter={capitulo}
          />
        ))}
      </div>
    </div>
  );
}
