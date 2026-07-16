// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('learnova_session')?.value
  const user = token ? await verifyToken(token) : null

  if (path.startsWith('/signup') && user) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (path.startsWith('/student') && user?.currentProfile !== 'STUDENT') {
    const redirectPath = user?.hasStudentProfile ? '/student' : '/student/onboarding'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  if (path.startsWith('/instructor') && user?.currentProfile !== 'INSTRUCTOR') {
    const redirectPath = user?.hasInstructorProfile ? '/instructor' : '/instructor/onboarding'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  if (path.startsWith('/admin') && user?.systemRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/signup', '/login', '/dashboard/:path*', '/student/:path*', '/instructor/:path*', '/admin/:path*'],
}