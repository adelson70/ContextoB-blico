import { getVersiculos, validateBookAndChapter, getReferencias, getComentario } from '@/data/biblia';
import { notFound } from 'next/navigation';
import { VerseBlock } from '@components/verse-block/index';

interface BibliaPageProps {
  params: { livro: string; capitulo: string };
}



export default function BibliaDisplayPage({ params }: BibliaPageProps) {
  const { livro, capitulo } = params;
  const valid = validateBookAndChapter(livro, capitulo);
  if (!valid) return notFound();
  const versiculos = getVersiculos(valid.slug, capitulo);
  if (!versiculos) return notFound();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-6 tracking-tight text-center">
        {valid.nomeBonito?.toUpperCase() || valid.slug.toUpperCase()} {capitulo}
      </h1>
      <div
        className="w-full bg-background/80 rounded-xl p-4 shadow-lg grid gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}
      >
        {versiculos.map((v, i) => {
          // Busca referências reais para cada versículo
          const referencias = getReferencias(valid.slug, String(valid.capitulo), String(i + 1));
          return (
            <VerseBlock
              key={i}
              number={i + 1}
              text={v}
              comment={getComentario(valid.slug, String(valid.capitulo), String(i + 1)) || undefined}
              reference={referencias ? referencias.join('; ') : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
