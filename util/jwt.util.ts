import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface AccessTokenPayload extends JwtPayload {
    userId: string;
}

export interface RefreshTokenPayload extends JwtPayload {
    userId: string;
}

// Tipo para as configurações JWT
interface JWTConfig {
    access: {
        secret: Secret;
        expiresIn: string;
    };
    refresh: {
        secret: Secret;
        expiresIn: string;
    };
}

// Função para validar e criar a configuração
function createJwtConfig(): JWTConfig {
    const accessSecret = process.env.JAT_TOKEN;
    const accessExpire = process.env.JAT_EXPIRE;
    const refreshSecret = process.env.JRT_TOKEN;
    const refreshExpire = process.env.JRT_EXPIRE;

    if (!accessSecret || !accessExpire || !refreshSecret || !refreshExpire) {
        throw new Error("Uma ou mais variáveis de ambiente para JWT (JAT/JRT) não foram definidas.");
    }

    return {
        access: {
            secret: accessSecret as Secret,
            expiresIn: accessExpire,
        },
        refresh: {
            secret: refreshSecret as Secret,
            expiresIn: refreshExpire,
        },
    };
}

const jwtConfig: JWTConfig = createJwtConfig();

export function expireInMs(time: string): number {
    const converteTempo = {
        'ms': 1, 's': 1000, 'm': 60000,
        'h': 3600000, 'd': 86400000
    };
    type UnidadeDeTempo = keyof typeof converteTempo;
    const numeroStr = time.match(/\d+/)?.[0] ?? '1';
    const numero = parseInt(numeroStr, 10);
    const unidadeTempoStr = (time.match(/[a-z]+/i) ?? ['s'])[0].toLowerCase();
    const unidadeTempo = unidadeTempoStr as UnidadeDeTempo;
    const multiplicador = converteTempo[unidadeTempo];
    if (multiplicador === undefined) {
        console.error(`Unidade de tempo "${unidadeTempo}" é inválida.`);
        return 0;
    }
    return numero * multiplicador;
}

export function generateAccessToken(payload: { userId: string }): string {
    return jwt.sign(payload, jwtConfig.access.secret, { 
        expiresIn: jwtConfig.access.expiresIn as any
    });
}

export function generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, jwtConfig.refresh.secret, { 
        expiresIn: jwtConfig.refresh.expiresIn as any
    });
}

export function generateTokens(payload: { userId: string }): { accessToken: string; refreshToken: string } {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        const decoded = jwt.verify(token, jwtConfig.access.secret);
        return decoded as AccessTokenPayload;
    } catch (error) {
        return null;
    }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
        const decoded = jwt.verify(token, jwtConfig.refresh.secret);
        return decoded as RefreshTokenPayload;
    } catch (error) {
        return null;
    }
}

// Função auxiliar para criar string de cookie
function createCookieString(name: string, value: string, maxAge: number): string {
    const maxAgeInSeconds = Math.floor(maxAge / 1000);
    const expires = new Date(Date.now() + maxAge).toUTCString();
    
    let cookieString = `${name}=${value}; Max-Age=${maxAgeInSeconds}; Expires=${expires}; Path=/; HttpOnly; SameSite=Strict`;
    
    if (process.env.NODE_ENV === 'production') {
        cookieString += '; Secure';
    }
    
    return cookieString;
}

export function sendAccessTokenCookie(res: NextResponse, payload: { userId: string }): string {
    const accessToken = generateAccessToken(payload);
    const maxAge = expireInMs(jwtConfig.access.expiresIn);
    
    const cookieString = createCookieString('jat', accessToken, maxAge);
    
    // Obtém cookies existentes
    const existingCookies = res.headers.get('Set-Cookie') || '';
    const cookiesArray = existingCookies ? existingCookies.split(', ') : [];
    
    // Remove cookie JAT existente se houver
    const filteredCookies = cookiesArray.filter(cookie => !cookie.startsWith('jat='));
    
    // Adiciona novo cookie
    filteredCookies.push(cookieString);
    
    res.headers.set('Set-Cookie', filteredCookies.join(', '));
    
    return accessToken;
}

export function sendRefreshTokenCookie(res: NextResponse, payload: { userId: string }): string {
    const refreshToken = generateRefreshToken(payload);
    const maxAge = expireInMs(jwtConfig.refresh.expiresIn);
    
    const cookieString = createCookieString('jrt', refreshToken, maxAge);
    
    // Obtém cookies existentes
    const existingCookies = res.headers.get('Set-Cookie') || '';
    const cookiesArray = existingCookies ? existingCookies.split(', ') : [];
    
    // Remove cookie JRT existente se houver
    const filteredCookies = cookiesArray.filter(cookie => !cookie.startsWith('jrt='));
    
    // Adiciona novo cookie
    filteredCookies.push(cookieString);
    
    res.headers.set('Set-Cookie', filteredCookies.join(', '));
    
    return refreshToken;
}

export function sendTokensCookies(res: NextResponse, payload: { userId: string }): { accessToken: string; refreshToken: string } {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    const accessMaxAge = expireInMs(jwtConfig.access.expiresIn);
    const refreshMaxAge = expireInMs(jwtConfig.refresh.expiresIn);
    
    const accessCookie = createCookieString('jat', accessToken, accessMaxAge);
    const refreshCookie = createCookieString('jrt', refreshToken, refreshMaxAge);
    
    // Obtém cookies existentes
    const existingCookies = res.headers.get('Set-Cookie') || '';
    const cookiesArray = existingCookies ? existingCookies.split(', ') : [];
    
    // Remove cookies JAT e JRT existentes se houver
    const filteredCookies = cookiesArray.filter(cookie => 
        !cookie.startsWith('jat=') && !cookie.startsWith('jrt=')
    );
    
    // Adiciona novos cookies
    filteredCookies.push(accessCookie, refreshCookie);
    
    res.headers.set('Set-Cookie', filteredCookies.join(', '));
    
    return { accessToken, refreshToken };
}

export function clearTokensCookies(res: NextResponse): void {
    const expiredAccessCookie = createCookieString('jat', '', 0);
    const expiredRefreshCookie = createCookieString('jrt', '', 0);
    
    // Obtém cookies existentes
    const existingCookies = res.headers.get('Set-Cookie') || '';
    const cookiesArray = existingCookies ? existingCookies.split(', ') : [];
    
    // Remove cookies JAT e JRT existentes se houver
    const filteredCookies = cookiesArray.filter(cookie => 
        !cookie.startsWith('jat=') && !cookie.startsWith('jrt=')
    );
    
    // Adiciona cookies expirados
    filteredCookies.push(expiredAccessCookie, expiredRefreshCookie);
    
    res.headers.set('Set-Cookie', filteredCookies.join(', '));
}

export function getAccessTokenFromCookies(req: NextRequest): string | null {
    return req.cookies.get('jat')?.value || null;
}

export function getRefreshTokenFromCookies(req: NextRequest): string | null {
    return req.cookies.get('jrt')?.value || null;
}

// Funções helper que retornam NextResponse já configurado
export function createResponseWithAccessToken(payload: { userId: string }, data?: any, status?: number): NextResponse {
    const response = NextResponse.json(data || { success: true }, { status: status || 200 });
    sendAccessTokenCookie(response, payload);
    return response;
}

export function createResponseWithRefreshToken(payload: { userId: string }, data?: any, status?: number): NextResponse {
    const response = NextResponse.json(data || { success: true }, { status: status || 200 });
    sendRefreshTokenCookie(response, payload);
    return response;
}

export function createResponseWithTokens(payload: { userId: string }, data?: any, status?: number): NextResponse {
    const response = NextResponse.json(data || { success: true }, { status: status || 200 });
    sendTokensCookies(response, payload);
    return response;
}

export function createResponseWithClearedTokens(data?: any, status?: number): NextResponse {
    const response = NextResponse.json(data || { success: true }, { status: status || 200 });
    clearTokensCookies(response);
    return response;
}