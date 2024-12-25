import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user role is not teacher, redirect to home page
  if (token.role !== "teacher") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/upload-question"], // Protect this route
};
