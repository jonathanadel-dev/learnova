import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { buildGoogleAuthUrl } from '@/lib/auth/oauth'

const STATE_COOKIE = 'oauth_state'

export async function GET() {
    const state = randomBytes(32).toString('hex')

    const store = await cookies()
    store.set(STATE_COOKIE, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 5
    })

    return NextResponse.redirect(buildGoogleAuthUrl(state))
}