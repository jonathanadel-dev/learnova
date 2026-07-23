'use client';
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginInput, loginSchema } from "@/lib/schemas/auth";
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


export default function LoginForm(){

    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (values: LoginInput) => {

        try{
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
    
            const data = await res.json()
    
            if (!res.ok) {
                if (data.error && typeof data.error === 'object') {
                    Object.entries(data.error).forEach(([field, messages]) => {
                        setError(field as keyof LoginInput, {
                            message: (messages as string[])[0],
                        })
                    })
                } else {
                    toast.error(data.error ?? 'Something went wrong')
                }
                return
            }
    
            toast.success('Logged in successfully!')
            router.push('/home')
            router.refresh()
        }catch(error){
            toast.error('Unable to log in. Please try again.')
        }
    
    }

    return(
        <AuthCard>
            <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle className="text-[30px] font-bold">
                    Welcome Back!
                </CardTitle>
                <CardDescription className="text-hash text-xs text-center">
                    Sign in to continue your learning journey and pick up where you left off.
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-email">
                                        EMAIL
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-email"
                                        className="h-13"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="markus.holt@example.com"
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
                                    <FieldLabel htmlFor="login-password">
                                        PASSWORD
                                    </FieldLabel>
                                    <PasswordInput
                                        {...field}
                                        className="h-13"
                                        id="login-password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
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
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login <ArrowRight size={14} />
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
                    New to Learnova?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold hover:underline underline-offset-2"
                        style={{ color: "#818CF8" }}
                    >
                        Sign Up
                    </Link>
                </p>
            </CardFooter>
        </AuthCard>
    )
}