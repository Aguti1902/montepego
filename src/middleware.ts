import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/portal")
  ) {
    return updateSession(request);
  }

  const response = handleI18n(request);
  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
