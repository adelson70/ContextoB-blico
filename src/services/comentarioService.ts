import { prisma } from '@/src/lib/prisma';

// Busca comentário de um versículo específico
export async function getComentarioByVersiculo(livroSlug: string, capitulo: number, versiculo: number) {
  return prisma.comentario.findFirst({
    where: { 
      livroSlug, 
      capitulo, 
      versiculo
    },
  });
}

// Service: lógica de acesso ao banco
export async function getComentariosByCapitulo(livroSlug: string, capitulo: number) {
  return prisma.comentario.findMany({
    where: { 
      livroSlug, 
      capitulo
    },
    orderBy: { versiculo: 'asc' },
  });
}

// Cria um novo comentário
export async function createComentario(data: {
  livroSlug: string;
  capitulo: number;
  versiculo: number;
  texto: string;
}) {
  return prisma.comentario.create({
    data: {
      livroSlug: data.livroSlug,
      capitulo: data.capitulo,
      versiculo: data.versiculo,
      texto: data.texto,
    },
  });
}

// Delete de um comentário
export async function deleteComentario(id: number) {
  return prisma.comentario.delete({
    where: { id }
  });
}
