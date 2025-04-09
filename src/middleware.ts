import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	const isPublicPath = path === '/login';

	// These cookie session are a refference from the NextAuth website
	const token =
		request.cookies.get('next-auth.session-token')?.value ||
		request.cookies.get('__Secure-next-auth.session-token')?.value;

	if (isPublicPath && token) {
		// Token Exist, redirect to dashboard
		return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
	}

	if (!isPublicPath && !token) {
		// Token does not exist, redirect to login
		return NextResponse.redirect(new URL('/login', request.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/login'],
};
