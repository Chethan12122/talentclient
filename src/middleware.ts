import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip all dashboard routes - let the layout handle authentication
  if (pathname.startsWith('/dashboard')) {
    console.log('Middleware: Allowing dashboard route:', pathname);
    return NextResponse.next();
  }

  console.log('Middleware: Processing non-dashboard route:', pathname);

  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  const publicRoutes = ['/authpage/login', '/authpage/signup'];

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && !publicRoutes.includes(pathname) && pathname !== '/') {
    console.log('Middleware: Redirecting to login');
    return NextResponse.redirect(new URL('/authpage/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
