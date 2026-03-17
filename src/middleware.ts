import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/tasks',
  '/chat',
  '/review',
  '/history',
];

// Routes that require specific roles
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/analytics': ['admin', 'tpo'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '');
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  const isRoleRestrictedRoute = Object.keys(ROLE_RESTRICTED_ROUTES).some(route =>
    pathWithoutLocale.startsWith(route)
  );

  // Check for authentication (Supabase session cookie)
  const token = request.cookies.get('sb-token');

  // If accessing protected route without token, redirect to login
  if ((isProtectedRoute || isRoleRestrictedRoute) && !token) {
    const locale = pathname.startsWith('/es') ? 'es' : 'en';
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // For role-restricted routes, you would typically:
  // 1. Decode the JWT token
  // 2. Extract user role from token or user metadata
  // 3. Compare with required roles
  // 4. Redirect if unauthorized

  // This basic implementation assumes roles would be checked on the client side
  // For full RBAC, implement JWT decoding and role validation here

  // Apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
