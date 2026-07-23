import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('learnova_session')?.value
  const user = token ? await verifyToken(token) : null

  if ((path.startsWith('/signup') || path.startsWith('/login')) && user) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  if (path.startsWith('/student')) {

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (path !== "/student/onboarding" && !user.hasStudentProfile) {
      return NextResponse.redirect(new URL('/student/onboarding', request.url))
    }

  }

  if (path.startsWith('/instructor') && user?.currentProfile !== 'INSTRUCTOR') {

      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (path !== "/instructor/onboarding" && !user.hasInstructorProfile) {
        return NextResponse.redirect(new URL('/instructor/onboarding', request.url))
      }

  }

  if (path.startsWith('/admin') && user?.systemRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/signup', '/login', '/student/:path*', '/instructor/:path*', '/admin/:path*'],
}