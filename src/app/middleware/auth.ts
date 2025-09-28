import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setAuthCookies, getAuthPayload } from '@/src/util/jwt.util'

export async function AuthMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isProtectedRoute = pathname.startsWith('/admin')
    const isPublicRoute = pathname.startsWith('/admin/login')

    if (isPublicRoute) return NextResponse.next()

    const access_token = request.cookies.get('jat')?.value
    const refresh_token = request.cookies.get('jrt')?.value

    if (!access_token && !refresh_token && isProtectedRoute) return NextResponse.redirect('/admin/login')
        
    if (!access_token && refresh_token && isProtectedRoute) {
        const payload = getAuthPayload()
        
        if (!payload) return void

        await setAuthCookies(payload)

        return NextResponse.next()
    }

    return NextResponse.next()

}