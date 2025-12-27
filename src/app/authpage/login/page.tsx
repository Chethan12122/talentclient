"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const [bgLoaded, setBgLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src =
      "https://gvdlmloehyoecithrqer.supabase.co/storage/v1/object/public/test/1746619106-WhatsApp%20Image%202025-05-07%20at%2016.47.14.jpeg"
    img.onload = () => setBgLoaded(true)
  }, [])

  return (
    <main className="relative min-h-[100dvh] flex items-center justify-center p-6 overflow-hidden">
      {/* Fallback background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Image background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          bgLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "url('https://gvdlmloehyoecithrqer.supabase.co/storage/v1/object/public/test/1746619106-WhatsApp%20Image%202025-05-07%20at%2016.47.14.jpeg')",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />

        <div className="flex justify-center mt-4">
          <p className="text-white bg-black/60 rounded-lg px-4 py-2 text-sm font-bold">
            Don&apos;t have an account?{" "}
            <Link href="/authpage/signup" className="text-yellow-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
