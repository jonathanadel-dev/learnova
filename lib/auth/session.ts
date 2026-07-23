import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import { JWTPayload } from 'jose'
import prisma from '@/lib/prisma'

const COOKIE_NAME = 'learnova_session'

export type CurrentUser = {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    systemRole: string
    hasStudentProfile: boolean
    hasInstructorProfile: boolean
    emailVerified: boolean
}

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

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const payload = await getUserFromCookie()
    if (!payload || typeof payload.userId !== 'string') return null

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { studentProfile: true, instructorProfile: true },
    })

    if (!user) return null

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        systemRole: user.systemRole,
        hasStudentProfile: !!user.studentProfile,
        hasInstructorProfile: !!user.instructorProfile,
        emailVerified: !!user.emailVerified,
    }
}