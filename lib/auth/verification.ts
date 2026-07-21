import { randomBytes, createHash } from 'crypto'
import prisma from '@/lib/prisma'
import { resend } from '@/lib/email/resend'
import { VerifyEmail } from '@/emails/VerifyEmail'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 48 // 48 hours

export function hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
}

export async function createVerificationToken(userId: string) {
    const rawToken = randomBytes(32).toString('hex')

    await prisma.verificationToken.deleteMany({ where: { userId } })

    await prisma.verificationToken.create({
        data: {
            userId,
            tokenHash: hashToken(rawToken),
            expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
    })

    return rawToken
}

export async function sendVerificationEmail(userId: string, email: string, name: string) {
    const rawToken = await createVerificationToken(userId)
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${rawToken}`

    await resend.emails.send({
        from: 'Learnova <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your Learnova email',
        react: VerifyEmail({ name, verifyUrl }),
    })
}