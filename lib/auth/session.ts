// lib/auth/session.ts
import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import { JWTPayload } from 'jose'

const COOKIE_NAME = 'learnova_session'

export async function setAuthCookie(token: string) {
    const store = await cookies()
    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    })
}

export async function getUserFromCookie(): Promise<JWTPayload | null> {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
}

export async function clearAuthCookie() {
    const store = await cookies()
    store.delete(COOKIE_NAME)
}