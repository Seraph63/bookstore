import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Recuperiamo un cookie di sessione (o un flag)
  // Nota: Il localStorage non funziona nel middleware perché è lato server
  const isAuthenticated = request.cookies.get('auth_session');

  const isLoginPage = request.nextUrl.pathname === '/login';

  // 1. Se l'utente non è loggato e non è già sulla pagina di login, lo mandiamo lì
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Se l'utente è loggato e prova ad andare su /login, lo mandiamo al catalogo
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Definiamo su quali rotte deve agire il middleware
export const config = {
  matcher: ['/', '/profile/:path*', '/login', '/cart', '/orders'],
};