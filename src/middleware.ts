// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
	const env = process.env.NODE_ENV;

	if (
		env !== 'development' &&
		req.nextUrl.pathname.startsWith('/investments')
	) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return NextResponse.next();
}
