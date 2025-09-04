"use client"

import type * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginData = {
  email: string
  password: string
}

export function LoginForm() {
  const [data, setData] = useState<LoginData>({ email: "", password: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setData((d) => ({ ...d, [name]: value }))
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
      // TODO: Connect to backend API (e.g., POST /api/login) with { email, password }
      console.log("[login] submitting", { ...data, email: data.email.trim().toLowerCase() })
      await new Promise((r) => setTimeout(r, 600))
      // e.g., redirect on success
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-balance">Welcome back</CardTitle>
        <CardDescription className="text-pretty">Sign in with your email and password to continue.</CardDescription>
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
  )
}
