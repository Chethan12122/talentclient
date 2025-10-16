 import Link from "next/link"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
}

export default function LoginPage() {
  return (
    <main
      className="flex min-h-[100dvh] items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('https://gvdlmloehyoecithrqer.supabase.co/storage/v1/object/public/test/1746619106-WhatsApp%20Image%202025-05-07%20at%2016.47.14.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" aria-hidden="true"></div>
      <div className="w-full max-w-sm z-10">
        <LoginForm />
        <div className="flex justify-center mt-4">
          <p className="text-center text-sm font-bold text-white bg-black/60 rounded-lg px-4 py-2 inline-block">
            {"Don't have an account? "}
            <Link href="/authpage/signup" className="text-primary underline-offset-4 hover:underline font-bold text-yellow-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
