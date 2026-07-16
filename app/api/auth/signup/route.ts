import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/session'
import { signupSchema } from '@/lib/schemas/auth';
import { AppError } from '@/lib/errors';

export async function POST(request: NextRequest) {
    try {

        const body = await request.json()
        
        // Zod validation
        const result = signupSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }
        const { name, email, password } = result.data
        
        const user = await prisma.$transaction(async (tx) => {
            const existing = await tx.user.findUnique({ where: { email } })
            
            if (existing && existing.emailVerified) {
                throw new AppError('Email already in use', 409)
            }
            
            if (existing && !existing.emailVerified) {
                await tx.user.delete({ where: { id: existing.id } })
            }
            
            const passwordHash = await hash(password, 10)

            return tx.user.create({
                data: { name, email, passwordHash },
            })
        })

        const token = await signToken({
            userId: user.id,
            hasStudentProfile: false,
            hasInstructorProfile: false,
            currentProfile: null,
            systemRole: 'USER',
            emailVerified: false,
        })

        await setAuthCookie(token)


        // sendVerificationEmail(user.id, user.email).catch((err) =>
        //     console.error('Failed to send verification email:', err)
        // )

        return NextResponse.json(
            { id: user.id, name: user.name, email: user.email },
            { status: 201 }
        )
    } catch (err) {
        if (err instanceof AppError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            )
        }

        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500, }
        )
    }
}