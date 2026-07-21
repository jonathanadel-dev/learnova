import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/session'
import { hashToken } from '@/lib/auth/verification'

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/home?error=missing_token', request.url))
    }

    const tokenHash = hashToken(token)
    const record = await prisma.verificationToken.findUnique({ where: { tokenHash } })

    if (!record || record.expiresAt < new Date()) {
        if (record) {
            await prisma.verificationToken.delete({ where: { id: record.id } })
        }
        return NextResponse.redirect(new URL('/home?error=expired_token', request.url))
    }

    const user = await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: record.userId },
            data: { emailVerified: new Date() },
        })
        await tx.verificationToken.delete({ where: { id: record.id } })

        return tx.user.findUniqueOrThrow({
            where: { id: record.userId },
            include: { studentProfile: true, instructorProfile: true },
        })
    })

    const jwt = await signToken({
        userId: user.id,
        hasStudentProfile: !!user.studentProfile,
        hasInstructorProfile: !!user.instructorProfile,
        currentProfile: null,
        systemRole: user.systemRole,
        emailVerified: true,
    })
    await setAuthCookie(jwt)

    return NextResponse.redirect(new URL('/home?verified=true', request.url))
}