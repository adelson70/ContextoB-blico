import { NextRequest } from 'next/server'
import { ipLogger } from './src/app/middleware/ipLogger'
import { AuthMiddleware } from './src/app/middleware/auth'

export function middleware(req: NextRequest) {

    const rota = req.nextUrl.pathname

    if (rota.includes('admin')) {
        return AuthMiddleware(req) 
    }

    return ipLogger(req)
}

