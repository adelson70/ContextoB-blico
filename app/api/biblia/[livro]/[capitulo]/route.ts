import { NextResponse } from 'next/server';
import { getVersiculos } from '@biblia-util/biblia';

interface RouteParams {
    params: {
        livro: string;
        capitulo: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    
    const { livro, capitulo } = await params;

    console.log(`Livro: ${livro}, Capítulo: ${capitulo}`);

    const versiculos = getVersiculos(livro, capitulo);

    return NextResponse.json({ livro, capitulo, versiculos });
}