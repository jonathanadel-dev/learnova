import prisma from '@/lib/prisma'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

type GoogleUserInfo = {
    sub: string
    email: string
    email_verified: boolean
    name: string
    picture?: string
}

export function buildGoogleAuthUrl(state: string) {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'select_account',
    })

    return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeGoogleCode(code: string) {
    const res = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            grant_type: 'authorization_code',
            code,
        }),
    })

    if (!res.ok) {
        throw new Error(`Google token exchange failed: ${await res.text()}`)
    }

    const data = (await res.json()) as { access_token: string }
    return data.access_token
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
        throw new Error(`Google userinfo fetch failed: ${await res.text()}`)
    }

    return res.json()
}

export async function resolveGoogleUser(profile: GoogleUserInfo) {
    const existingAccount = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider: 'GOOGLE',
                providerAccountId: profile.sub,
            },
        },
        include: { user: { include: { studentProfile: true, instructorProfile: true } } },
    })

    if (existingAccount) {
        return existingAccount.user
    }

    return prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: { email: profile.email },
            include: { studentProfile: true, instructorProfile: true },
        })

        // Only link to an existing account if it's already verified. An
        // unverified User could have been created by anyone typing this
        // email into the signup form - it's not proof of ownership. If we
        // linked to it anyway, the real owner logging in with Google here
        // would be handed straight into an account someone else already
        // controls the password for. Treating it as a fresh signup instead
        // means the impersonated account is simply abandoned/unverified,
        // not silently taken over.
        if (existingUser && existingUser.emailVerified) {
            await tx.account.create({
                data: {
                    userId: existingUser.id,
                    provider: 'GOOGLE',
                    providerAccountId: profile.sub,
                },
            })

            return existingUser
        }

        // An unverified User already sitting on this email isn't proof of
        // ownership - anyone could have typed it into the password signup
        // form. Reclaim the email the same way signup/route.ts already
        // does for this exact case, so it doesn't collide with the
        // unique constraint below.
        if (existingUser) {
            await tx.user.delete({ where: { id: existingUser.id } })
        }

        const newUser = await tx.user.create({
            data: {
                name: profile.name,
                email: profile.email,
                emailVerified: profile.email_verified ? new Date() : null,
                avatarUrl: profile.picture ?? null,
                accounts: {
                    create: {
                        provider: 'GOOGLE',
                        providerAccountId: profile.sub,
                    },
                },
            },
            include: { studentProfile: true, instructorProfile: true },
        })

        return newUser
    })
}