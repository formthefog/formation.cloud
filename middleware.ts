import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isDocsSubdomain = host.startsWith("docs.");

  const { pathname } = request.nextUrl;

  //   // Block access to /docs from non-docs subdomain
  //   if (pathname.startsWith("/docs") && !isDocsSubdomain) {
  //     return new NextResponse(null, { status: 404 });
  //   }

  // Rewrite requests like /getting-started to /docs/getting-started on the docs subdomain
  if (isDocsSubdomain && !pathname.startsWith("/docs")) {
    const url = request.nextUrl.clone();
    url.pathname = "/docs" + pathname;
    return NextResponse.rewrite(url);
  }

  // Redirect /marketplace to /
  if (pathname.startsWith("/marketplace")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
