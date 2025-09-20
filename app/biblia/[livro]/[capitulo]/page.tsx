import { getVersiculos, validateBookAndChapter } from '@/data/biblia';
import { notFound } from 'next/navigation';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold text-text mb-4">
        {valid.nomeBonito.toUpperCase()} {capitulo}
      </h1>
      <div className="w-full max-w-xl bg-background rounded-xl p-4 shadow">
        {versiculos.map((v, i) => (
          <div key={i} className="text-text mb-1">
            <span className="font-bold">{i + 1}</span> {v}
          </div>
        ))}
      </div>
    </div>
  );
}
