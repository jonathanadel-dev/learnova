"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
    const [visible, setVisible] = React.useState(false)
    const hasValue = Boolean(props.value ?? props.defaultValue)

    return (
        <div className="relative">
            <Input
                type={visible ? "text" : "password"}
                className={cn("pr-10", className)}
                {...props}
            />
            {hasValue && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    )
}