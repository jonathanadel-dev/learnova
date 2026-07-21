import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth/session'
import { sendVerificationEmail } from '@/lib/auth/verification'
import { AppError } from '@/lib/errors'

const RESEND_COOLDOWN_MS = 60 * 1000

export async function POST() {
    try {
        const payload = await getUserFromCookie()
        if (!payload || typeof payload.userId !== 'string') {
            throw new AppError('Not authenticated', 401)
        }

        const user = await prisma.user.findUnique({ where: { id: payload.userId } })
        if (!user) {
            throw new AppError('Not authenticated', 401)
        }
        if (user.emailVerified) {
            throw new AppError('Email is already verified', 400)
        }

        const lastToken = await prisma.verificationToken.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        if (lastToken && Date.now() - lastToken.createdAt.getTime() < RESEND_COOLDOWN_MS) {
            throw new AppError('Please wait a moment before requesting another email', 429)
        }

        await sendVerificationEmail(user.id, user.email, user.name)

        return NextResponse.json({ success: true })
    } catch (err) {
        if (err instanceof AppError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode })
        }

        console.error('Resend verification email failed:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}