"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyEmail, resendVerificationEmail } from "@/services/auth.api"
import { CheckCircle, Mail, AlertCircle } from "lucide-react"
import { ApiError } from "@/types/auth.types"

interface VerifyFormProps {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function VerifyForm({ onSuccess, onError }: VerifyFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")

  // Auto-verify if token is in URL (from email link)
  useEffect(() => {
    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    if (emailParam) {
      setEmail(emailParam)
    }

    if (token) {
      // Auto-verify with token from email link
      handleTokenVerification(token)
    }
  }, [searchParams])

  async function handleTokenVerification(token: string) {
    setSubmitting(true)
    try {
      const response = await verifyEmail({ token })
      setSuccess(true)
      setMessage(response.message || "Email verified successfully!")
      
      if (onSuccess) {
        onSuccess(response.message || "Email verified successfully!")
      }

      // Redirect to login after successful verification
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
      
    } catch (err) {
      console.error("Token verification error:", err)
      let errorMessage = "Verification failed. Please try again."
      
      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setErrors({ form: errorMessage })
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }))
    }
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value)
    // Clear code error when user starts typing
    if (errors.code) {
      setErrors(prev => ({ ...prev, code: "" }))
    }
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!email.trim()) {
      e.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.email = "Enter a valid email address."
    }
    if (!code.trim()) {
      e.code = "Verification code is required."
    }
    return e
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const v = validate()
    setErrors(v)
    
    if (Object.keys(v).length > 0) {
      return
    }

    setSubmitting(true)
    
    try {
      const response = await verifyEmail({
        email: email.trim().toLowerCase(),
        code: code.trim()
      })
      
      setSuccess(true)
      setMessage(response.message || "Email verified successfully!")
      
      if (onSuccess) {
        onSuccess(response.message || "Email verified successfully!")
      }

      // Redirect to login after successful verification
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
      
    } catch (err) {
      console.error("Verification error:", err)
      let errorMessage = "Verification failed. Please try again."
      
      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setErrors({ form: errorMessage })
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResendEmail() {
    if (!email.trim()) {
      setErrors({ email: "Please enter your email address first." })
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Enter a valid email address." })
      return
    }

    setResending(true)
    
    try {
      const response = await resendVerificationEmail(email.trim().toLowerCase())
      setMessage("Verification email sent! Please check your inbox.")
      setErrors({}) // Clear any existing errors
    } catch (err) {
      console.error("Resend email error:", err)
      let errorMessage = "Failed to send verification email."
      
      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setErrors({ resend: errorMessage })
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <Card className="border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-balance">Email Verified Successfully!</CardTitle>
          <CardDescription className="text-pretty">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Redirecting you to login page...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-balance">Verify Your Email</CardTitle>
        <CardDescription className="text-pretty">
          Enter your email and the verification code we sent you, or click the verification link in your email.
        </CardDescription>
      </CardHeader>

      <div onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          {errors.form ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          ) : null}

          {message && !errors.form ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
              aria-invalid={!!errors.email}
            />
            {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleCodeChange}
              required
              maxLength={6}
              aria-invalid={!!errors.code}
            />
            {errors.code ? <p className="text-xs text-destructive">{errors.code}</p> : null}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={handleResendEmail}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend email"}
              </Button>
            </p>
            {errors.resend ? <p className="text-xs text-destructive mt-1">{errors.resend}</p> : null}
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2">
          <Button type="submit" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Verifying..." : "Verify Email"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/auth/login')}
          >
            Back to Login
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}