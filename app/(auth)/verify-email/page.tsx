// app/(auth)/verify-email/page.tsx
import { redirect } from "next/navigation"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import CheckYourEmail from "@/components/auth/CheckYourEmail"
import { getCurrentUser } from "@/lib/auth/session";

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        return redirect("/login")
    }

    if (user?.emailVerified) {
        return redirect("/home")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 items-center justify-center px-6">
                <CheckYourEmail email={user?.email} />
            </div>
        </div>
    )
}