import { NextRequest } from 'next/server'
import { ipLogger } from './app/middleware/ipLogger'

export function middleware(req: NextRequest) {
    return ipLogger(req)
}

export const config = {
    matcher: ['/biblia/:livro/:capitulo'],
}

