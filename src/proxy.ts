// Proxy-style middleware for Next.js 16+
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/tasks', '/chat', '/review', '/history'];
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/analytics': ['admin', 'tpo'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const localeMatch = pathname.match(/^\/(es|en)/);
  const locale = localeMatch ? localeMatch[1] : 'es';
  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';

  if (!['es', 'en'].includes(locale)) {
    return NextResponse.redirect(new URL(`/es${pathname}`, request.url));
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathWithoutLocale.startsWith(route));
  const isRoleRestrictedRoute = Object.keys(ROLE_RESTRICTED_ROUTES).some(route => pathWithoutLocale.startsWith(route));
  const token = request.cookies.get('sb-token');

  if ((isProtectedRoute || isRoleRestrictedRoute) && !token) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
