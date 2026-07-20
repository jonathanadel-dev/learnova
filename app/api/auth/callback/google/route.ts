import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/session'
import { exchangeGoogleCode, fetchGoogleUserInfo, resolveGoogleUser } from '@/lib/auth/oauth'

const STATE_COOKIE = 'oauth_state'

export async function GET(request: NextRequest) {
    const url = request.nextUrl
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const errorParam = url.searchParams.get('error')

    const store = await cookies()
    const expectedState = store.get(STATE_COOKIE)?.value
    store.delete(STATE_COOKIE)

    if (errorParam) {
        return NextResponse.redirect(new URL('/login?error=oauth_denied', url))
    }

    if (!code || !state || !expectedState || state !== expectedState) {
        return NextResponse.redirect(new URL('/login?error=oauth_invalid_state', url))
    }

    try {
        const accessToken = await exchangeGoogleCode(code)
        const profile = await fetchGoogleUserInfo(accessToken)
        const user = await resolveGoogleUser(profile)

        const token = await signToken({
            userId: user.id,
            hasStudentProfile: !!user.studentProfile,
            hasInstructorProfile: !!user.instructorProfile,
            currentProfile: null,
            systemRole: user.systemRole,
            emailVerified: !!user.emailVerified,
        })

        await setAuthCookie(token)

        return NextResponse.redirect(new URL('/home', url))
    } catch (err) {
        console.error('Google OAuth callback failed:', err)
        return NextResponse.redirect(new URL('/login?error=oauth_failed', url))
    }
}