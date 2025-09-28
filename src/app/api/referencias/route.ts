import { NextRequest, NextResponse } from 'next/server';
import { getReferenciasByCapitulo, deleteReferencia, createReferencia } from '@/src/services/referenciaService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const livroSlug = searchParams.get('livroSlug');
    const capitulo = searchParams.get('capitulo');
    const versiculo = searchParams.get('versiculo');

    if (!livroSlug || !capitulo || !versiculo) {
      return NextResponse.json({ error: 'Livro, capítulo e versículo são obrigatórios' }, { status: 400 });
    }

    const referencias = await getReferenciasByCapitulo(livroSlug, parseInt(capitulo), parseInt(versiculo));
    return NextResponse.json(referencias);
  } catch (error) {
    console.error('Erro ao buscar referências:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { livroSlug, capitulo, versiculo, referencia } = body;

    if (!livroSlug || !capitulo || !versiculo || !referencia) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const novaReferencia = await createReferencia({
      livroSlug,
      capitulo: parseInt(capitulo),
      versiculo: parseInt(versiculo),
      referencia
    });

    return NextResponse.json(novaReferencia);
  } catch (error) {
    console.error('Erro ao criar referência:', error);
    
    // Verificar se é erro de referência duplicada
    if (error instanceof Error && error.message === 'Esta referência já existe para este versículo') {
      return NextResponse.json({ 
        error: 'Esta referência já existe para este versículo',
        code: 'DUPLICATE_REFERENCE'
      }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await deleteReferencia(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar referência:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
