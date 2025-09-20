import { getVersiculos, validateBookAndChapter } from '@/data/biblia';
import { notFound } from 'next/navigation';
import { VerseBlock } from '@/app/components/verse-block';

interface BibliaPageProps {
  params: { livro: string; capitulo: string };
}

// Exemplo de comentários e referências (mock). Substitua por dados reais se necessário.
const comentarios: Record<number, string> = {
  1: "Comentário do versículo 1.",
  3: "Nota especial sobre o versículo 3.",
};
const referencias: Record<number, string> = {
  2: "Ver também João 1:1.",
};

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
        }}
        /*
          grid-cols-1: 1 coluna no mobile
          md:grid-cols-2: 2 colunas em telas médias ou maiores
          gap-4: espaçamento entre colunas e linhas
        */
      >
        {versiculos.map((v, i) => (
          <VerseBlock
            key={i}
            number={i + 1}
            text={v}
            comment={comentarios[i + 1]}
            reference={referencias[i + 1]}
          />
        ))}
      </div>
    </div>
  );
}
