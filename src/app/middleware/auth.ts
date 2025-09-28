import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/src/util/jwt.util'

export async function AuthMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Pega os tokens dos cookies
    const accessToken = request.cookies.get('jat')?.value;
    const refreshToken = request.cookies.get('jrt')?.value;

    // console.log('rota', pathname)
    // console.log('access', accessToken)
    // console.log('refresh', refreshToken)

    // Define qual é a rota de autenticação (pública)
    const isAuthRoute = pathname.startsWith('/admin/login');

    // Se o usuário está na rota de login
    if (isAuthRoute) {
        // Caso 1: Se tem tokens válidos, não deve estar no login -> redireciona para /admin
        if (accessToken && verifyAccessToken(accessToken)) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        // Se não, permite o acesso à página de login
        return NextResponse.next();
    }

    // Se o usuário está tentando acessar qualquer rota protegida que NÃO seja a de login
    if (pathname.startsWith('/admin')) {
        // Caso 1: Tem um access token válido, permite o acesso
        if (accessToken && verifyAccessToken(accessToken)) {
            return NextResponse.next();
        }

        // Caso 2: Não tem access token, mas tem um refresh token válido
        if (!accessToken && refreshToken) {
            const payload = verifyRefreshToken(refreshToken);
            if (payload) {
                const newAccessToken = generateAccessToken({ userId: payload.userId });

                // Cria uma nova resposta para continuar a navegação E definir o novo cookie
                const response = NextResponse.next();
                response.cookies.set('jat', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    sameSite: 'strict',
                });
                console.log('✅ Access Token renovado com sucesso!');
                return response;
            }
        }

        // Caso 3 e 4: Não tem tokens, ou os tokens existentes são inválidos
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        
        console.log('❌ Tokens inválidos ou ausentes. Limpando cookies e redirecionando.');
        // Limpa quaisquer cookies inválidos que possam existir
        response.cookies.delete('jat');
        response.cookies.delete('jrt');
        
        return response;
    }

    // Para todas as outras rotas fora de /admin
    return NextResponse.next();
}