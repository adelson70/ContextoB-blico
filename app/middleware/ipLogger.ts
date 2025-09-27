import { NextRequest, NextResponse } from 'next/server'

export function ipLogger(req: NextRequest) {

    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'IP não encontrado'

    const requestHeaders = new Headers(req.headers)

    requestHeaders.set('x-client-ip', ip)

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    })
}
