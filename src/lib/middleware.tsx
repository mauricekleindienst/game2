import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase_server'

export async function middleware(request: NextRequest) {
  // The matcher config should now prevent this middleware from running for /auth/* routes.
  // The explicit check is removed for simplicity.
  console.log("Middleware: Running updateSession for", request.nextUrl.pathname); // Added log
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/ (authentication routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}