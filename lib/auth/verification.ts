import { randomBytes, createHash } from 'crypto'
import prisma from '@/lib/prisma'
import { mailer } from '@/lib/email/gmail'
import { VerifyEmail } from '@/emails/VerifyEmail'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 48

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

    if (!process.env.APP_URL) {
        throw new Error('APP_URL is not configured')
    }

    const rawToken = await createVerificationToken(userId)
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${rawToken}`

    const html = VerifyEmail({ name, verifyUrl })

    await mailer.sendMail({
        from: `Learnova <${process.env.GMAIL_SENDER_EMAIL}>`,
        to: email,
        subject: 'Verify your Learnova email',
        html,
    })
}