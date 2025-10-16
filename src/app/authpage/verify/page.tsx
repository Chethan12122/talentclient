"use client"

import { Suspense } from "react"
import { VerifyForm } from "@/components/auth/verify-form"

function VerifyPageContent() {
  const handleSuccess = (message: string) => {
    console.log("Verification successful:", message)
  }

  const handleError = (error: string) => {
    console.error("Verification error:", error)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <VerifyForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}