import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Replace 'your_salt' and 'your_secret' with your actual salt and secret values
  const token = await getToken({ req: request as any, salt: 'your_salt', secret: 'your_secret' });
  const url = request.nextUrl
  if(token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname.startsWith('/')
  )){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }  




  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  // See "Matching Paths" below to learn more
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:part*',
    '/verify/:path*'
  ],
};
