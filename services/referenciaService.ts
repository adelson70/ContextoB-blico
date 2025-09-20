// Busca todas as referências de um versículo específico
export async function getReferenciaByVersiculo(livroSlug: string, capitulo: number, versiculo: number) {
  return prisma.referencia.findMany({
    where: { livroSlug, capitulo, versiculo },
    orderBy: { id: 'asc' },
  });
}
import { prisma } from '@/lib/prisma';

// Service: lógica de acesso ao banco
export async function getReferenciasByCapitulo(livroSlug: string, capitulo: number) {
  return prisma.referencia.findMany({
    where: { livroSlug, capitulo },
    orderBy: { versiculo: 'asc' },
  });
}
