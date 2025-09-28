import { NextRequest } from 'next/server'
import { ipLogger } from './app/middleware/ipLogger'
import { AuthMiddleware } from './app/middleware/auth'

export function middleware(req: NextRequest) {

    const rota = req.nextUrl.pathname

    if (rota.includes('admin')) {
        return AuthMiddleware(req) 
    }

    return ipLogger(req)
}

