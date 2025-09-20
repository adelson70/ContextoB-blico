/**
 * Valida se o livro e capítulo existem na lista de livros e capítulos da bíblia.
 * @param livroNome Nome do livro (ex: "João")
 * @param capitulo Capítulo como string ou número
 * @returns { slug: string, abrev: string, capitulo: number } se válido, ou null se inválido
 */
export function validateBookAndChapter(livroNome: string, capitulo: string | number): { slug: string, abrev: string, capitulo: number } | null {
  const nomeNormalizado = livroNome.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const livro = livros.find(l =>
    l.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === nomeNormalizado
    || l.abrev.toLowerCase() === nomeNormalizado
    || l.slug.toLowerCase() === nomeNormalizado
  );
  if (!livro) return null;
  const capNum = typeof capitulo === "string" ? parseInt(capitulo, 10) : capitulo;
  if (isNaN(capNum) || capNum < 1 || capNum > livro.cap) return null;
  return { slug: livro.slug, abrev: livro.abrev, capitulo: capNum };
}
import bibliaNVI from '@/data/biblia-nvi.json'

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
    {slug: '1-samuel', name: '1 Samuel', cap: 31, abrev: '1s'},
    {slug: '2-samuel', name: '2 Samuel', cap: 24, abrev: '2s'},
    {slug: '1-reis', name: '1 Reis', cap: 22, abrev: '1r'},
    {slug: '2-reis', name: '2 Reis', cap: 25, abrev: '2r'},
    {slug: '1-cronicas', name: '1 Crônicas', cap: 29, abrev: '1c'},
    {slug: '2-cronicas', name: '2 Crônicas', cap: 36, abrev: '2c'},
    {slug: 'esdras', name: 'Esdras', cap: 10, abrev: 'es'},
    {slug: 'neemias', name: 'Neemias', cap: 13, abrev: 'ne'},
    {slug: 'ester', name: 'Ester', cap: 10, abrev: 'est'},
    {slug: 'jo', name: 'Jó', cap: 42, abrev: 'jo'},
    {slug: 'salmos', name: 'Salmos', cap: 150, abrev: 'sl'},
    {slug: 'proverbios', name: 'Provérbios', cap: 31, abrev: 'pv'},
    {slug: 'eclesiastes', name: 'Eclesiastes', cap: 12, abrev: 'ec'},
    {slug: 'cantares', name: 'Cânticos', cap: 8, abrev: 'ct'},
    {slug: 'isaias', name: 'Isaías', cap: 66, abrev: 'is'},
    {slug: 'jeremias', name: 'Jeremias', cap: 52, abrev: 'je'},
    {slug: 'lamentacoes', name: 'Lamentações', cap: 5, abrev: 'la'},
    {slug: 'ezequiel', name: 'Ezequiel', cap: 48, abrev: 'ez'},
    {slug: 'daniel', name: 'Daniel', cap: 12, abrev: 'da'},
    {slug: 'oseias', name: 'Oseias', cap: 14, abrev: 'os'},
    {slug: 'joel', name: 'Joel', cap: 3, abrev: 'jo'},
    {slug: 'amos', name: 'Amós', cap: 9, abrev: 'am'},
    {slug: 'obadias', name: 'Obadias', cap: 1, abrev: 'ob'},
    {slug: 'jonas', name: 'Jonas', cap: 4, abrev: 'jo'},
    {slug: 'miqueias', name: 'Miquéias', cap: 7, abrev: 'mi'},
    {slug: 'naum', name: 'Naum', cap: 3, abrev: 'na'},
    {slug: 'habacuque', name: 'Habacuque', cap: 3, abrev: 'ha'},
    {slug: 'sofonias', name: 'Sofonias', cap: 3, abrev: 'so'},
    {slug: 'ageu', name: 'Ageu', cap: 2, abrev: 'ag'},
    {slug: 'zacarias', name: 'Zacarias', cap: 14, abrev: 'za'},
    {slug: 'malaquias', name: 'Malaquias', cap: 4, abrev: 'ma'},
    {slug: 'mateus', name: 'Mateus', cap: 28, abrev: 'mt'},
    {slug: 'marcos', name: 'Marcos', cap: 16, abrev: 'mr'},
    {slug: 'lucas', name: 'Lucas', cap: 24, abrev: 'lu'},
    {slug: 'joao', name: 'João', cap: 21, abrev: 'jo'},
    {slug: 'atos', name: 'Atos', cap: 28, abrev: 'at'},
    {slug: 'romanos', name: 'Romanos', cap: 16, abrev: 'ro'},
    {slug: '1-corintios', name: '1 Coríntios', cap: 16, abrev: '1c'},
    {slug: '2-corintios', name: '2 Coríntios', cap: 13, abrev: '2c'},
    {slug: 'galatas', name: 'Gálatas', cap: 6, abrev: 'ga'},
    {slug: 'efesios', name: 'Efésios', cap: 6, abrev: 'ef'},
    {slug: 'filipenses', name: 'Filipenses', cap: 4, abrev: 'fi'},
    {slug: 'colossenses', name: 'Colossenses', cap: 4, abrev: 'co'},
    {slug: '1-tessalonicenses', name: '1 Tessalonicenses', cap: 5, abrev: '1t'},
    {slug: '2-tessalonicenses', name: '2 Tessalonicenses', cap: 3, abrev: '2t'},
    {slug: '1-timoteo', name: '1 Timóteo', cap: 6, abrev: '1t'},
    {slug: '2-timoteo', name: '2 Timóteo', cap: 4, abrev: '2t'},
    {slug: 'tito', name: 'Tito', cap: 3, abrev: 'ti'},
    {slug: 'filemom', name: 'Filemom', cap: 1, abrev: 'fi'},
    {slug: 'hebreus', name: 'Hebreus', cap: 13, abrev: 'he'},
    {slug: 'tiago', name: 'Tiago', cap: 5, abrev: 'ti'},
    {slug: '1-pedro', name: '1 Pedro', cap: 5, abrev: '1p'},
    {slug: '2-pedro', name: '2 Pedro', cap: 3, abrev: '2p'},
    {slug: '1-joao', name: '1 João', cap: 5, abrev: '1j'},
    {slug: '2-joao', name: '2 João', cap: 1, abrev: '2j'},
    {slug: '3-joao', name: '3 João', cap: 1, abrev: '3j'},
    {slug: 'judas', name: 'Judas', cap: 1, abrev: 'ju'},
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

