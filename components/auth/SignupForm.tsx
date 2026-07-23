'use client';
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupInput, signupSchema } from "@/lib/schemas/auth";
import { ArrowRight, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"
import PasswordInput from "./PasswordInput";
import { GoogleIcon } from "../icons/GoogleIcon";


export default function SignupForm(){

    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', email: '', password: '' },
    })

    const onSubmit = async (values: SignupInput) => {

        try{
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
    
            const data = await res.json()
    
            if (!res.ok) {
                if (data.error && typeof data.error === 'object') {
                    Object.entries(data.error).forEach(([field, messages]) => {
                        setError(field as keyof SignupInput, {
                            message: (messages as string[])[0],
                        })
                    })
                } else {
                    toast.error(data.error ?? 'Something went wrong')
                }
                return
            }
    
            toast.success('Account created successfully!')
            router.push('/verify-email')
            router.refresh()
        }catch{
            toast.error('Unable to create account. Please try again.')
        }
    
    }

    return(
        <AuthCard>
            <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle className="text-[30px] font-bold">
                    Join
                    <span className="ml-2 gradient-text font-heading font-bold tracking-tight">
                        Learnova
                    </span>
                </CardTitle>
                <CardDescription className="text-hash text-xs">
                    Create your account to explore courses and start learning.
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-name">
                                        DISPLAY NAME
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-name"
                                        aria-invalid={fieldState.invalid}
                                        className="h-13"
                                        placeholder="Markus Holt"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-email">
                                        EMAIL
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-email"
                                        aria-invalid={fieldState.invalid}
                                        className="h-13"
                                        placeholder="markusholt@me.com"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-password">
                                        PASSWORD
                                    </FieldLabel>
                                    <PasswordInput
                                        {...field}
                                        className="h-13"
                                        id="signup-password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Minimum 8 characters"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button
                        type="submit"
                        className="mt-2 h-13 w-full justify-center gap-2 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-primary-foreground disabled:hover:shadow-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create account <ArrowRight size={14} />
                            </>
                        )}
                    </Button>

                </form>

                <div className="my-4 flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>

                <Button
                    variant="outline"
                    className="h-13 w-full justify-center gap-2"
                    render={<a href="/api/auth/google" />}
                >
                    <GoogleIcon className="size-4" />
                    Continue with Google
                </Button>

            </CardContent>

            <CardFooter className="flex flex-col justify-center gap-2">
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold hover:underline underline-offset-2"
                        style={{ color: "#818CF8" }}
                    >
                        Log in
                    </Link>
                </p>
            </CardFooter>
        </AuthCard>
    )
}