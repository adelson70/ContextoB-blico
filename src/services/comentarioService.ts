// Busca comentário de um versículo específico
export async function getComentarioByVersiculo(livroSlug: string, capitulo: number, versiculo: number) {
  return prisma.comentario.findFirst({
    where: { livroSlug, capitulo, versiculo },
  });
}
import { prisma } from '@/src/lib/prisma';

// Service: lógica de acesso ao banco
export async function getComentariosByCapitulo(livroSlug: string, capitulo: number) {
  return prisma.comentario.findMany({
    where: { livroSlug, capitulo },
    orderBy: { versiculo: 'asc' },
  });
}
