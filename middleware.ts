import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Check for Supabase auth cookie
  const sbAuthToken = request.cookies.get('sb-jkhulkbhytcywgjls-auth-token')

  // If user IS authenticated (Supabase) and trying to access login/signup, redirect to home
  if (sbAuthToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Note: We don't enforce auth in middleware for the home page because:
  // 1. Mock auth uses localStorage (not available on server)
  // 2. Client-side components will enforce auth checks
  // 3. This allows smooth development with both Supabase and mock auth

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*'],
}

