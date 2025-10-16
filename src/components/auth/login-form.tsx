"use client"

import type * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, getDashboardPath, ApiError, extractUserRoleFromResponse } from "@/services/auth.api"

type LoginData = {
  email: string
  password: string
}

type UserType = "ATHLETE" | "REFEREE" | "TEAM MANAGER"

interface LoginFormProps {
  onSuccess?: (message: string, userData?: any) => void
  onError?: (error: string) => void 
}

export function LoginForm({
  onSuccess,
  onError,
}: LoginFormProps) {
  const [data, setData] = useState<LoginData>({ email: "", password: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<UserType>("ATHLETE")
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setData((d) => ({ ...d, [name]: value }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  function validate(): string | null {
    if (!data.email.trim()) return "Email is required."
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return "Enter a valid email address."
    if (!data.password) return "Password is required."
    if (data.password.length < 8) return "Password must be at least 8 characters."
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setSubmitting(true)
    try {
      console.log("Attempting login for:", data.email); // Debug log
      
      // Use the real login function from auth-api
      const response = await login(
        data.email.trim().toLowerCase(),
        data.password,
        "APP"
      )

      console.log("Login response received:", response); // Debug log

      // Use the helper function to extract role from response
// In your login form, after successful login:
const UserRole = extractUserRoleFromResponse(response);
console.log("Extracted user role:", UserRole);

if (!UserRole || !["ATHLETE", "REFEREE", "TEAM MANAGER"].includes(UserRole)) {
  throw new Error("Unable to determine account type. Please contact support.");
}

// Manually ensure cookies are set (backup)
document.cookie = `user_role=${UserRole}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
document.cookie = `access_token=${response.data.access_token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;

console.log("🍪 Cookies set manually as backup");

if (onSuccess) {
  onSuccess(response.message, response.data);
}

// Navigate with a small delay
setTimeout(() => {
  const dashboardPath = getDashboardPath(UserRole);
  console.log("Navigating to:", dashboardPath);
  router.replace(dashboardPath);
}, 200); // Increased delay


    } catch (err) {
      console.error("Login error:", err); // Debug log
      
      let errorMessage = "Login failed. Please try again.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border rounded-md overflow-hidden bg-gray-100">
        <Button
          variant={userType === "ATHLETE" ? "default" : "ghost"}
          onClick={() => setUserType("ATHLETE")}
          className="flex-1 rounded-none"
          disabled={submitting}
        >
          Athlete
        </Button>
        <Button
          variant={userType === "REFEREE" ? "default" : "ghost"}
          onClick={() => setUserType("REFEREE")}
          className="flex-1 rounded-none"
          disabled={submitting}
        >
          Referee
        </Button>
        <Button
          variant={userType === "TEAM MANAGER" ? "default" : "ghost"}
          onClick={() => setUserType("TEAM MANAGER")}
          className="flex-1 rounded-none"
          disabled={submitting}
        >
          Team Manager
        </Button>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-balance">Welcome back</CardTitle>
          <CardDescription className="text-pretty">
            Sign in as a {userType.toLowerCase().replace('_', ' ')} with your email and password to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={handleChange}
                required
                disabled={submitting}
                aria-invalid={!!error && !/^\S+@\S+\.\S+$/.test(data.email)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={submitting}
                aria-invalid={!!error && data.password.length < 8}
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
