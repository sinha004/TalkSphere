import { NextResponse } from 'next/server';

export function middleware(request) {
 const user = request.cookies.get("username")?.value;
// console.log(user)
  // If user is not logged in, redirect to the login page
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in, continue to the requested route
  return NextResponse.next();
}

export const config = {
  matcher: ['/chatbot', '/connect', '/message'], // Apply middleware to these routes
};
