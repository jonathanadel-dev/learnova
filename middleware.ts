// middleware.ts
import { getUserFromCookie } from '@/lib/auth/session'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const user = await getUserFromCookie() // decodes JWT, no DB call

  const path = request.nextUrl.pathname

  if (path.startsWith('/student') && !user?.hasStudentProfile) {
    return NextResponse.redirect(new URL('/student/onboarding', request.url))
  }
  if (path.startsWith('/instructor') && !user?.hasInstructorProfile) {
    return NextResponse.redirect(new URL('/instructor/onboarding', request.url))
  }
  if (path.startsWith('/admin') && user?.systemRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/instructor/:path*', '/admin/:path*', '/dashboard/:path*'],
}