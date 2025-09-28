import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface AuthPayload extends JwtPayload {
    userId: number;
}

const JWT_CONFIG = {
    access: {
        secret: process.env.JAT_TOKEN as Secret,
        expiresIn: process.env.JAT_EXPIRE || '15m',
    },
    refresh: {
        secret: process.env.JRT_TOKEN as Secret,
        expiresIn: process.env.JRT_EXPIRE || '7d',
    },
};

if (!JWT_CONFIG.access.secret || !JWT_CONFIG.refresh.secret) {
    throw new Error("Variáveis de ambiente JAT_TOKEN e JRT_TOKEN devem ser definidas.");
}

function convertTimeToMs(time: string): number {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);
    const conversions: Record<string, number> = {
        's': 1000,
        'm': 60 * 1000,
        'h': 3600 * 1000,
        'd': 86400 * 1000,
    };
    return value * (conversions[unit] || 0);
}

// --- Lógica Pura de JWT ---

function generateAccessToken(payload: { userId: number }): string {
    return jwt.sign(payload, JWT_CONFIG.access.secret, {
        // Correção aplicada: `as any` para contornar o problema de tipagem da biblioteca
        expiresIn: JWT_CONFIG.access.expiresIn as any,
    });
}

function generateRefreshToken(payload: { userId: number }): string {
    return jwt.sign(payload, JWT_CONFIG.refresh.secret, {
        // Correção aplicada: `as any` para contornar o problema de tipagem da biblioteca
        expiresIn: JWT_CONFIG.refresh.expiresIn as any,
    });
}

export function verifyAccessToken(token: string): AuthPayload | null {
    try {
        return jwt.verify(token, JWT_CONFIG.access.secret) as AuthPayload;
    } catch (error) {
        return null;
    }
}

// --- Gerenciamento de Cookies (Server-Side) ---

export async function setAuthCookies(payload: { userId: number }): Promise<void> {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const cookieStore = await cookies();

    const secure = process.env.NODE_ENV === 'production';

    cookieStore.set('jat', accessToken, {
        httpOnly: true,
        secure,
        path: '/',
        sameSite: 'strict',
        expires: new Date(Date.now() + convertTimeToMs(JWT_CONFIG.access.expiresIn)),
    });

    cookieStore.set('jrt', refreshToken, {
        httpOnly: true,
        secure,
        path: '/',
        sameSite: 'strict',
        expires: new Date(Date.now() + convertTimeToMs(JWT_CONFIG.refresh.expiresIn)),
    });
}

export async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set('jat', '', { expires: new Date(0), path: '/' });
    cookieStore.set('jrt', '', { expires: new Date(0), path: '/' });
}

export async function getAuthPayload(): Promise<AuthPayload | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('jat')?.value;
    
    if (!accessToken) {
        return null;
    }
    
    return verifyAccessToken(accessToken);
}