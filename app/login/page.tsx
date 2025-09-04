import Link from "next/link"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
