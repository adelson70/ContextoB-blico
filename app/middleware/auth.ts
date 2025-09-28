import { NextRequest, NextResponse } from 'next/server'
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from '@/util/jwt.util'


export async function AuthMiddleware(req: NextRequest) {
    const rota = req.nextUrl.pathname

    const access_token =  getAccessTokenFromCookies(req)
    const refresh_token = getRefreshTokenFromCookies(req)

    if (!access_token && !refresh_token && rota === '/admin') {

        return NextResponse.redirect(new URL('/admin/login',req.url))
    }

    return NextResponse.next()

}
