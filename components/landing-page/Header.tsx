import {ArrowRight, GraduationCap} from "lucide-react";
import Link from "next/link";
import LinkButton from "../utils/LinkButton";

export default function Header(){
    return(
        <header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10"
        >
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
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
                    <span className="text-sm font-bold tracking-tight text-foreground">Learnova</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2">

                    <LinkButton href="/login" variant="outline">
                        Log In
                    </LinkButton>

                    <LinkButton href="/signup" variant="default">
                        <span className="inline-flex items-center gap-2">
                            Sign Up
                            <ArrowRight size={16} />
                        </span>
                    </LinkButton>

                </div>

            </div>
        </header>
    )
}