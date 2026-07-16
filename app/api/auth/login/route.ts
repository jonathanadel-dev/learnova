// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import prisma  from '@/lib/prisma'
import { signToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/session'
import { loginSchema } from '@/lib/schemas/auth'
import { AppError } from '@/lib/errors'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = loginSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const { email, password } = result.data

        const user = await prisma.user.findUnique({
            where: { email },
            include: { studentProfile: true, instructorProfile: true },
        })


        if (!user || !(await compare(password, user.passwordHash))) {
            throw new AppError('Invalid email or password', 401)
        }

        const token = await signToken({
            userId: user.id,
            hasStudentProfile: !!user.studentProfile,
            hasInstructorProfile: !!user.instructorProfile,
            currentProfile: null,
            systemRole: user.systemRole,
            emailVerified: !!user.emailVerified
        })

        await setAuthCookie(token)

        return NextResponse.json(
            { id: user.id, name: user.name, email: user.email },
            { status: 200 }
        )
    } catch (err) {
        if (err instanceof AppError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode })
        }

        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}