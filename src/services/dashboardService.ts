import { prisma } from '@/src/lib/prisma';

export interface KpiData {
  leiturasHoje: number;
  usuariosAtivosHoje: number;
  livroMaisLidoHoje: string;
  capituloMaisLidoHoje: string;
}

export interface DailyActivityData {
  labels: string[];
  data: number[];
}

export interface TopBooksData {
  labels: string[];
  data: number[];
}

export class DashboardService {
  /**
   * Busca os dados dos KPIs para hoje
   */
  static async getKpiData(): Promise<KpiData> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Leituras hoje
    const leiturasHoje = await prisma.pesquisa.count({
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        }
      }
    });

    // Usuários ativos hoje (IPs únicos)
    const usuariosAtivosHoje = await prisma.pesquisa.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        }
      }
    }).then(result => result.length);

    // Livro mais lido hoje
    const livroMaisLidoHojeResult = await prisma.pesquisa.groupBy({
      by: ['nome_livro'],
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        }
      },
      _count: {
        nome_livro: true
      },
      orderBy: {
        _count: {
          nome_livro: 'desc'
        }
      },
      take: 1
    });

    const livroMaisLidoHoje = livroMaisLidoHojeResult.length > 0 
      ? this.formatarNomeLivro(livroMaisLidoHojeResult[0].nome_livro)
      : 'N/A';

    // Capítulo mais lido hoje
    const capituloMaisLidoHojeResult = await prisma.pesquisa.groupBy({
      by: ['nome_livro', 'capitulo_livro'],
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        }
      },
      _count: {
        nome_livro: true
      },
      orderBy: {
        _count: {
          nome_livro: 'desc'
        }
      },
      take: 1
    });

    const capituloMaisLidoHoje = capituloMaisLidoHojeResult.length > 0 
      ? `${this.formatarNomeLivro(capituloMaisLidoHojeResult[0].nome_livro)} ${capituloMaisLidoHojeResult[0].capitulo_livro}`
      : 'N/A';

    return {
      leiturasHoje,
      usuariosAtivosHoje,
      livroMaisLidoHoje,
      capituloMaisLidoHoje
    };
  }

  /**
   * Busca os dados de atividade diária dos últimos 30 dias
   */
  static async getDailyActivityData(): Promise<DailyActivityData> {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    trintaDiasAtras.setHours(0, 0, 0, 0);

    // Buscar todos os registros dos últimos 30 dias
    const registros = await prisma.pesquisa.findMany({
      where: {
        createdAt: {
          gte: trintaDiasAtras
        }
      },
      select: {
        createdAt: true
      }
    });

    // Agrupar por data
    const dadosMap = new Map<string, number>();
    
    registros.forEach(registro => {
      const dataStr = registro.createdAt.toISOString().split('T')[0];
      dadosMap.set(dataStr, (dadosMap.get(dataStr) || 0) + 1);
    });

    // Criar array com todos os dias dos últimos 30 dias
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const dataAtual = new Date(hoje);
      dataAtual.setDate(dataAtual.getDate() - i);
      const dataStr = dataAtual.toISOString().split('T')[0];
      
      labels.push(this.formatarData(dataAtual));
      data.push(dadosMap.get(dataStr) || 0);
    }

    return { labels, data };
  }

  /**
   * Busca os dados dos livros mais populares
   */
  static async getTopBooksData(): Promise<TopBooksData> {
    const topBooks = await prisma.pesquisa.groupBy({
      by: ['nome_livro'],
      _count: {
        nome_livro: true
      },
      orderBy: {
        _count: {
          nome_livro: 'desc'
        }
      },
      take: 10
    });

    const labels = topBooks.map(item => this.formatarNomeLivro(item.nome_livro));
    const data = topBooks.map(item => Number(item._count.nome_livro));

    return { labels, data };
  }

  /**
   * Formata o nome do livro para exibição
   */
  private static formatarNomeLivro(livroSlug: string): string {
    const nomesLivros: { [key: string]: string } = {
      'genesis': 'Gênesis',
      'exodo': 'Êxodo',
      'levitico': 'Levítico',
      'numeros': 'Números',
      'deuteronomio': 'Deuteronômio',
      'josue': 'Josué',
      'juizes': 'Juízes',
      'rute': 'Rute',
      '1-samuel': '1 Samuel',
      '2-samuel': '2 Samuel',
      '1-reis': '1 Reis',
      '2-reis': '2 Reis',
      '1-cronicas': '1 Crônicas',
      '2-cronicas': '2 Crônicas',
      'esdras': 'Esdras',
      'neemias': 'Neemias',
      'ester': 'Ester',
      'jo': 'Jó',
      'salmos': 'Salmos',
      'proverbios': 'Provérbios',
      'eclesiastes': 'Eclesiastes',
      'cantares': 'Cantares',
      'isaias': 'Isaías',
      'jeremias': 'Jeremias',
      'lamentacoes': 'Lamentações',
      'ezequiel': 'Ezequiel',
      'daniel': 'Daniel',
      'oseias': 'Oséias',
      'joel': 'Joel',
      'amos': 'Amós',
      'obadias': 'Obadias',
      'jonas': 'Jonas',
      'miqueias': 'Miquéias',
      'naum': 'Naum',
      'habacuque': 'Habacuque',
      'sofonias': 'Sofonias',
      'ageu': 'Ageu',
      'zacarias': 'Zacarias',
      'malaquias': 'Malaquias',
      'mateus': 'Mateus',
      'marcos': 'Marcos',
      'lucas': 'Lucas',
      'joao': 'João',
      'atos': 'Atos',
      'romanos': 'Romanos',
      '1-corintios': '1 Coríntios',
      '2-corintios': '2 Coríntios',
      'galatas': 'Gálatas',
      'efesios': 'Efésios',
      'filipenses': 'Filipenses',
      'colossenses': 'Colossenses',
      '1-tessalonicenses': '1 Tessalonicenses',
      '2-tessalonicenses': '2 Tessalonicenses',
      '1-timoteo': '1 Timóteo',
      '2-timoteo': '2 Timóteo',
      'tito': 'Tito',
      'filemom': 'Filemom',
      'hebreus': 'Hebreus',
      'tiago': 'Tiago',
      '1-pedro': '1 Pedro',
      '2-pedro': '2 Pedro',
      '1-joao': '1 João',
      '2-joao': '2 João',
      '3-joao': '3 João',
      'judas': 'Judas',
      'apocalipse': 'Apocalipse'
    };

    return nomesLivros[livroSlug.toLowerCase()] || livroSlug;
  }

  /**
   * Formata a data para exibição
   */
  private static formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  }
}
