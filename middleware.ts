import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware sementara dibuat pasif
 * Aman dari redirect loop
 * Siap diaktifkan nanti kalau mau proteksi route
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

/**
 * Matcher tetap disiapkan tapi tidak agresif
 * Tidak menyentuh:
 * - API routes
 * - static files
 * - next internals
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
