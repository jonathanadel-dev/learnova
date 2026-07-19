import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {type VariantProps} from "class-variance-authority";

interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
    href: string;
    height?: string;
    children: React.ReactNode;
}

export function LinkButton({href, variant, height, children}:LinkButtonProps) {
    return (
        <Link
            href={href}
            className={cn(buttonVariants({ variant, size: "default", className: `h-${height || '10'}` }))}
        >
            {children}
        </Link>
    )
}

export function GhostLinkButton({href, children}: {href: string, children: React.ReactNode}) {
    return (
        <Link
            href={href}
        >
            <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-foreground hover:bg-white/5 transition-all"
            >
                {children}
            </div>
        </Link>
    )
}