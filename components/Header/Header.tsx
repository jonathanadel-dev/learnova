'use client';
import { ArrowRight, BookOpen, GraduationCap, Search, Users} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LinkButton, GhostLinkButton } from "../utils/LinkButton";
import UserMenu from "./UserMenu";
import { CurrentUser } from "@/lib/auth/session";
import { Input } from "../ui/input";

export default function Header({ user }: { user: CurrentUser | null }){

    const pathname = usePathname();

    const landingPageHeader = (
        <div className="flex items-center gap-2">

            <GhostLinkButton href="/login">
                Log in
            </GhostLinkButton>

            <LinkButton href="/signup" variant="default" height="8">
                <span className="inline-flex items-center gap-1">
                    Sign up
                    <ArrowRight size={16} />
                </span>
            </LinkButton>

        </div>
    )

    const authHeader = (
        <GhostLinkButton href="/home">
            <span className="inline-flex items-center gap-2">
                Skip to Dashboard
                <ArrowRight size={16} />
            </span>
        </GhostLinkButton>
    )

    const goToDashboard = (
        <LinkButton href="/home" variant="ghost">
            <span className="inline-flex items-center gap-2">
                Go to Dashboard
                <ArrowRight size={16} />
            </span>
        </LinkButton>
    )

    return(
        <header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10"
        >
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group"
                >
                    <div
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-primary shadow-md group-hover:bg-primary/90 transition-colors"
                    >
                        <GraduationCap size={20} className="text-foreground" />
                    </div>
                    <span className="text-sm font-bold text-foreground tracking-tight">Learnova</span>
                </Link>

                {(pathname != '/signup' && pathname != '/login' && !pathname.startsWith('/verify-email')) ? (
                    <>
                        {/* Nav links */}
                        <nav className="hidden md:flex items-center gap-0.5 flex-1">
                            {[
                                { label: "Browse Courses", icon: <BookOpen size={13} /> },
                                { label: "Instructors", icon: <Users size={13} /> }
                            ].map((link) => (
                                <GhostLinkButton
                                    href='/'
                                    key={link.label}
                                >
                                    {link.icon}
                                    {link.label}
                                </GhostLinkButton>
                            ))}
                        </nav>
                        {/* Search */}
                        <div className="hidden lg:flex flex-1 max-w-xs">
                            <div className="relative w-full">
                                <Search
                                    size={13}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                                />
                                <Input
                                    className="w-full h-9 pl-8 bg-[#18181B]"
                                    placeholder="Search courses…"
                                />
                            </div>
                        </div>
                    </>
                ) : <div className="flex-1"/>}

                {pathname == '/' && (user ? goToDashboard : landingPageHeader)}
                {pathname == '/home' && (user ? <UserMenu user={user} /> : landingPageHeader)}
                {(pathname == '/signup' || pathname == '/login' || pathname.startsWith('/verify-email')) && authHeader}

            </div>
        </header>
    )
}