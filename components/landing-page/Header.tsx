import {ArrowRight, GraduationCap} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

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
                    <Link
                        href="/login"
                        className={cn(buttonVariants({ variant: "outline", size: "default", className: "px-6" }))}
                    >
                        Log In
                    </Link>

                    <Link
                        href="/signup"
                        className={cn(buttonVariants({ size: "default", className: "px-6" }))}
                    >
                        <span className="inline-flex items-center gap-2">
                        Sign Up
                        <ArrowRight size={16} />
                        </span>
                    </Link>
                </div>

            </div>
        </header>
    )
}