"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    BookOpen,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Plus,
    UserCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CurrentUser } from "@/lib/auth/session"
import { toast } from "sonner"

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

export default function UserMenu({ user }: { user: CurrentUser }) {

    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    const dashboardHref = user.hasInstructorProfile
        ? "/instructor"
        : user.hasStudentProfile
            ? "/student"
            : "/home"

    async function handleLogout() {
        setLoggingOut(true)
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" })
            if (!response.ok) throw new Error("Logout failed")
            router.replace("/")
            router.refresh()
        } catch {
            setLoggingOut(false)
            toast.error("Failed to log out. Please try again.")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 transition-colors hover:bg-muted"
            >
                <Avatar className="size-6">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                    <AvatarFallback className="text-[12px] bg-primary">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <span className="hidden text-xs font-medium text-foreground sm:block">
                    {user.name}
                </span>
                <ChevronDown size={12} className="text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <span className="block truncate font-medium text-foreground">
                            {user.name}
                        </span>
                        <span className="block truncate">{user.email}</span>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                    <LayoutDashboard />
                    Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserCircle />
                    My Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    disabled={loggingOut}
                    onClick={handleLogout}
                >
                    <LogOut />
                    {loggingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}