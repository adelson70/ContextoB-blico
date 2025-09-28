import { prisma } from '@/src/lib/prisma';

// Busca todas as referências de um versículo específico
export async function getReferenciaByVersiculo(livroSlug: string, capitulo: number, versiculo: number) {
  return prisma.referencia.findMany({
    where: { 
      livroSlug, 
      capitulo, 
      versiculo,
      isDeleted: false
    },
    orderBy: { id: 'asc' },
  });
}

// Service: lógica de acesso ao banco
export async function getReferenciasByCapitulo(livroSlug: string, capitulo: number, versiculo?: number) {
  const whereClause: any = { 
    livroSlug, 
    capitulo,
    isDeleted: false
  };

  if (versiculo !== undefined) {
    whereClause.versiculo = versiculo;
  }

  return prisma.referencia.findMany({
    where: whereClause,
    orderBy: { versiculo: 'asc' },
  });
}

// Cria uma nova referência
export async function createReferencia(data: {
  livroSlug: string;
  capitulo: number;
  versiculo: number;
  referencia: string;
}) {
  return prisma.referencia.create({
    data: {
      livroSlug: data.livroSlug,
      capitulo: data.capitulo,
      versiculo: data.versiculo,
      referencia: data.referencia,
    },
  });
}

// Soft delete de uma referência
export async function deleteReferencia(id: number) {
  return prisma.referencia.update({
    where: { id },
    data: { isDeleted: true }
  });
}
