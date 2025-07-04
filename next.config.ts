import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  // Adjust for your production domain
  const isDocsSubdomain = host.startsWith("docs.");

  // Redirect all /marketplace* to /
  if (request.nextUrl.pathname.startsWith("/marketplace")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isDocsSubdomain) {
    // Rewrite to /docs, preserving the rest of the path
    const url = request.nextUrl.clone();
    url.pathname = "/docs" + url.pathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Optionally, only run middleware for relevant paths
export const config = {
  matcher: [
    /*
      Match all routes except _next/static, _next/image, favicon, etc.
      Adjust as needed for your app.
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
