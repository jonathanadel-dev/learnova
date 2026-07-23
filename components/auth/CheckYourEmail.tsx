// components/auth/CheckYourEmail.tsx
"use client"

import { useState } from "react"
import { ArrowRight, MailCheck } from "lucide-react"
import { toast } from "sonner"

import AuthCard from "./AuthCard"
import { LinkButton } from "../utils/LinkButton"

export default function CheckYourEmail({ email }: { email: string | undefined }) {
    const [resending, setResending] = useState(false)

    async function handleResend() {
        setResending(true)
        try {
            const res = await fetch("/api/auth/resend-verification", { method: "POST" })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error ?? "Something went wrong")
                return
            }

            toast.success("Verification email resent")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setResending(false)
        }
    }

    return (
        <AuthCard>
            <div className="mx-auto gap-4 flex w-full max-w-md flex-col items-center py-10 px-8 text-center">
                <div className="relative mb-5">
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <linearGradient id="verify-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="hsl(243 80% 58%)" />
                                <stop offset="100%" stopColor="hsl(280 70% 65%)" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <MailCheck
                        className="size-14"
                        strokeWidth={1.5}
                        stroke="url(#verify-icon-gradient)"
                    />
                </div>

                <h1 className="text-2xl font-bold text-foreground">
                    Check Your Email
                </h1>

                <p className="mt-3 text-sm text-muted-foreground">
                    We sent a verification link to the email:
                    <br />
                    <span className="font-semibold text-primary-forground">{email}</span>
                </p>

                <p className="mt-4 text-xs text-muted-foreground">
                    If you don&apos;t see it, check your spam or junk folder.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    Didn&apos;t get the email?{" "}
                    <button
                        type="button"
                        disabled={resending}
                        onClick={handleResend}
                        className="text-primary underline underline-offset-2 hover:text-primary/80 disabled:opacity-50"
                    >
                        {resending ? "Resending..." : "Resend verification"}
                    </button>
                    .
                </p>

                <div className="mt-6 w-full">
                    <LinkButton
                        // className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                        href="/home"
                    >
                        <div className="flex items-center justify-center gap-2">
                            Continue (Skip Verification for Now)
                            <ArrowRight size={16} />
                        </div>
                    </LinkButton>
                </div>
            </div>
        </AuthCard>
    )
}