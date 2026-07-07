import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {type VariantProps} from "class-variance-authority";

interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
    href: string;
    height?: string;
    children: React.ReactNode;
}

export default function LinkButton({href, variant, height, children}:LinkButtonProps) {
    return (
        <Link
            href={href}
            className={cn(buttonVariants({ variant, size: "default", className: `px-6 h-${height || '10'}` }))}
        >
            {children}
        </Link>
    )
}