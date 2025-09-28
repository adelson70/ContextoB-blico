/**
 * Retorna o slug e capítulo do capítulo anterior.
 * Se for o primeiro capítulo do livro, retorna o último capítulo do livro anterior.
 * Se já for o primeiro capítulo do Gênesis, retorna null.
 */
export function getPreviousChapter(slug: string, capitulo: number | string): { slug: string, capitulo: number } | null {
  const idx = livros.findIndex(l => l.slug === slug);
  if (idx === -1) return null;
  const capNum = typeof capitulo === 'string' ? parseInt(capitulo, 10) : capitulo;
  if (capNum > 1) {
    return { slug, capitulo: capNum - 1 };
  } else if (idx > 0) {
    const prevLivro = livros[idx - 1];
    return { slug: prevLivro.slug, capitulo: prevLivro.cap };
  }
  return null;
}

/**
 * Retorna o slug e capítulo do próximo capítulo.
 * Se for o último capítulo do livro, retorna o primeiro capítulo do próximo livro.
 * Se já for o último capítulo do Apocalipse, retorna null.
 */
export function getNextChapter(slug: string, capitulo: number | string): { slug: string, capitulo: number } | null {
  const idx = livros.findIndex(l => l.slug === slug);
  if (idx === -1) return null;
  const livro = livros[idx];
  const capNum = typeof capitulo === 'string' ? parseInt(capitulo, 10) : capitulo;
  if (capNum < livro.cap) {
    return { slug, capitulo: capNum + 1 };
  } else if (idx < livros.length - 1) {
    const nextLivro = livros[idx + 1];
    return { slug: nextLivro.slug, capitulo: 1 };
  }
  return null;
}

/**
 * Retorna o path do menu principal (home)
 */
export function getMenuPath(): string {
  return '/';
}
import { getComentarioByVersiculo } from '@/src/services/comentarioService';
import { getReferenciaByVersiculo } from '@/src/services/referenciaService';

/**
 * Busca comentário no banco de dados para um versículo específico.
 * @param livroSlug slug do livro (ex: 'joao')
 * @param capitulo número do capítulo como string (ex: '3')
 * @param versiculo número do versículo como string (ex: '16')
 * @returns comentário ou null se não houver
 */
export async function getComentario(livroSlug: string, capitulo: string, versiculo: string): Promise<string | null> {
  const comentario = await getComentarioByVersiculo(livroSlug, Number(capitulo), Number(versiculo));
  return comentario?.texto || null;
}
/**
 * Valida se o livro e capítulo existem na lista de livros e capítulos da bíblia.
 * @param livroNome Nome do livro (ex: "João")
 * @param capitulo Capítulo como string ou número
 * @returns { slug: string, abrev: string, capitulo: number, nomeBonito: string } se válido, ou null se inválido
 */
export function validateBookAndChapter(livroNome: string, capitulo: string | number): { slug: string, abrev: string, capitulo: number, nomeBonito: string } | null {
  const nomeNormalizado = livroNome.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const livro = livros.find(l =>
    l.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === nomeNormalizado
    || l.abrev.toLowerCase() === nomeNormalizado
    || l.slug.toLowerCase() === nomeNormalizado
  );
  if (!livro) return null;
  const capNum = typeof capitulo === "string" ? parseInt(capitulo, 10) : capitulo;
  if (isNaN(capNum) || capNum < 1 || capNum > livro.cap) return null;
  return { slug: livro.slug, abrev: livro.abrev, capitulo: capNum, nomeBonito: livro.name };
}

import bibliaNVI from './biblia-nvi.json'

interface LivroBiblia {
    abbrev: string;
    name: string;
    chapters: string[][];
}

export const livros = [
    {slug: 'genesis', name: 'Gênesis', cap: 50, abrev: 'gn'},
    {slug: 'exodo', name: 'Êxodo', cap: 40, abrev: 'ex'},
    {slug: 'levitico', name: 'Levítico', cap: 27, abrev: 'lv'},
    {slug: 'numeros', name: 'Números', cap: 36, abrev: 'nm'},
    {slug: 'deuteronomio', name: 'Deuteronômio', cap: 34, abrev: 'dt'},
    {slug: 'josue', name: 'Josué', cap: 24, abrev: 'js'},
    {slug: 'juizes', name: 'Juízes', cap: 21, abrev: 'jz'},
    {slug: 'rute', name: 'Rute', cap: 4, abrev: 'rt'},
    {slug: '1-samuel', name: '1 Samuel', cap: 31, abrev: '1sm'},
    {slug: '2-samuel', name: '2 Samuel', cap: 24, abrev: '2sm'},
    {slug: '1-reis', name: '1 Reis', cap: 22, abrev: '1rs'},
    {slug: '2-reis', name: '2 Reis', cap: 25, abrev: '2rs'},
    {slug: '1-cronicas', name: '1 Crônicas', cap: 29, abrev: '1cr'},
    {slug: '2-cronicas', name: '2 Crônicas', cap: 36, abrev: '2cr'},
    {slug: 'esdras', name: 'Esdras', cap: 10, abrev: 'ed'},
    {slug: 'neemias', name: 'Neemias', cap: 13, abrev: 'ne'},
    {slug: 'ester', name: 'Ester', cap: 10, abrev: 'et'},
    {slug: 'jo', name: 'Jó', cap: 42, abrev: 'jó'},
    {slug: 'salmos', name: 'Salmos', cap: 150, abrev: 'sl'},
    {slug: 'proverbios', name: 'Provérbios', cap: 31, abrev: 'pv'},
    {slug: 'eclesiastes', name: 'Eclesiastes', cap: 12, abrev: 'ec'},
    {slug: 'cantares', name: 'Cânticos', cap: 8, abrev: 'ct'},
    {slug: 'isaias', name: 'Isaías', cap: 66, abrev: 'is'},
    {slug: 'jeremias', name: 'Jeremias', cap: 52, abrev: 'jr'},
    {slug: 'lamentacoes', name: 'Lamentações', cap: 5, abrev: 'lm'},
    {slug: 'ezequiel', name: 'Ezequiel', cap: 48, abrev: 'ez'},
    {slug: 'daniel', name: 'Daniel', cap: 12, abrev: 'dn'},
    {slug: 'oseias', name: 'Oseias', cap: 14, abrev: 'os'},
    {slug: 'joel', name: 'Joel', cap: 3, abrev: 'jl'},
    {slug: 'amos', name: 'Amós', cap: 9, abrev: 'am'},
    {slug: 'obadias', name: 'Obadias', cap: 1, abrev: 'ob'},
    {slug: 'jonas', name: 'Jonas', cap: 4, abrev: 'jn'},
    {slug: 'miqueias', name: 'Miquéias', cap: 7, abrev: 'mq'},
    {slug: 'naum', name: 'Naum', cap: 3, abrev: 'na'},
    {slug: 'habacuque', name: 'Habacuque', cap: 3, abrev: 'hc'},
    {slug: 'sofonias', name: 'Sofonias', cap: 3, abrev: 'sf'},
    {slug: 'ageu', name: 'Ageu', cap: 2, abrev: 'ag'},
    {slug: 'zacarias', name: 'Zacarias', cap: 14, abrev: 'zc'},
    {slug: 'malaquias', name: 'Malaquias', cap: 4, abrev: 'ml'},
    {slug: 'mateus', name: 'Mateus', cap: 28, abrev: 'mt'},
    {slug: 'marcos', name: 'Marcos', cap: 16, abrev: 'mc'},
    {slug: 'lucas', name: 'Lucas', cap: 24, abrev: 'lc'},
    {slug: 'joao', name: 'João', cap: 21, abrev: 'jo'},
    {slug: 'atos', name: 'Atos', cap: 28, abrev: 'atos'},
    {slug: 'romanos', name: 'Romanos', cap: 16, abrev: 'rm'},
    {slug: '1-corintios', name: '1 Coríntios', cap: 16, abrev: '1co'},
    {slug: '2-corintios', name: '2 Coríntios', cap: 13, abrev: '2co'},
    {slug: 'galatas', name: 'Gálatas', cap: 6, abrev: 'gl'},
    {slug: 'efesios', name: 'Efésios', cap: 6, abrev: 'ef'},
    {slug: 'filipenses', name: 'Filipenses', cap: 4, abrev: 'fp'},
    {slug: 'colossenses', name: 'Colossenses', cap: 4, abrev: 'cl'},
    {slug: '1-tessalonicenses', name: '1 Tessalonicenses', cap: 5, abrev: '1ts'},
    {slug: '2-tessalonicenses', name: '2 Tessalonicenses', cap: 3, abrev: '2ts'},
    {slug: '1-timoteo', name: '1 Timóteo', cap: 6, abrev: '1tm'},
    {slug: '2-timoteo', name: '2 Timóteo', cap: 4, abrev: '2tm'},
    {slug: 'tito', name: 'Tito', cap: 3, abrev: 'tt'},
    {slug: 'filemom', name: 'Filemom', cap: 1, abrev: 'fm'},
    {slug: 'hebreus', name: 'Hebreus', cap: 13, abrev: 'hb'},
    {slug: 'tiago', name: 'Tiago', cap: 5, abrev: 'tg'},
    {slug: '1-pedro', name: '1 Pedro', cap: 5, abrev: '1pe'},
    {slug: '2-pedro', name: '2 Pedro', cap: 3, abrev: '2pe'},
    {slug: '1-joao', name: '1 João', cap: 5, abrev: '1jo'},
    {slug: '2-joao', name: '2 João', cap: 1, abrev: '2jo'},
    {slug: '3-joao', name: '3 João', cap: 1, abrev: '3jo'},
    {slug: 'judas', name: 'Judas', cap: 1, abrev: 'jd'},
    {slug: 'apocalipse', name: 'Apocalipse', cap: 22, abrev: 'ap'},
]

const slugParaAbrevMap = new Map<string, string>();
for (const livro of livros) {
    slugParaAbrevMap.set(livro.slug, livro.abrev);
}

const bibliaMap = new Map<string, LivroBiblia>();
for (const livro of (bibliaNVI as LivroBiblia[])) {
    bibliaMap.set(livro.abbrev, livro);
}


export const getVersiculos = (livroSlug: string, capitulo: string): string[] | null => {
    const abrev = slugParaAbrevMap.get(livroSlug);
    if (!abrev) {
      return null;
    }

    const livroEncontrado = bibliaMap.get(abrev);
    if (!livroEncontrado) {
      return null;
    }

    const capituloNum = parseInt(capitulo, 10);
    if (isNaN(capituloNum) || capituloNum < 1 || capituloNum > livroEncontrado.chapters.length) {
      return null;
    }

    return livroEncontrado.chapters[capituloNum - 1];
}



/**
 * Busca referências cruzadas no banco de dados para um versículo específico.
 * @param livroSlug slug do livro (ex: 'joao')
 * @param capitulo número do capítulo como string (ex: '3')
 * @param versiculo número do versículo como string (ex: '16')
 * @returns array de referências ou null se não houver
 */
export async function getReferencias(livroSlug: string, capitulo: string, versiculo: string): Promise<string[] | null> {
  const referencias = await getReferenciaByVersiculo(livroSlug, Number(capitulo), Number(versiculo));
  if (!referencias || referencias.length === 0) return null;
  return referencias.map((r: { referencia: string }) => r.referencia);
}
