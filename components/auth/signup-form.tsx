"use client"

import type * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { register, ApiError } from "@/services/auth.api"

type Role = "ATHLETE" | "REFEREE" | "TEAM MANAGER"

type SignupData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  institution: string
  role: Role
  password: string
  confirmPassword: string
}

interface SignupFormProps {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const [data, setData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    institution: "",
    role: "ATHLETE",
    password: "",
    confirmPassword: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setData((d) => ({ ...d, [name]: value }))
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!data.firstName.trim()) e.firstName = "First name is required."
    if (!data.lastName.trim()) e.lastName = "Last name is required."
    if (!data.phone.trim()) {
      e.phone = "Phone number is required."
    } else if (!/^\+?[0-9\s\-()]{7,}$/.test(data.phone)) {
      e.phone = "Enter a valid phone number."
    }
    if (!data.email.trim()) e.email = "Email is required."
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email address."
    if (!data.institution.trim()) e.institution = "Institution is required."
    if (!data.password) e.password = "Password is required."
    else if (data.password.length < 8) e.password = "Password must be at least 8 characters."
    if (!data.confirmPassword) e.confirmPassword = "Confirm your password."
    else if (data.confirmPassword !== data.password) e.confirmPassword = "Passwords do not match."
    return e
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Form submitted, starting validation...")
    
    const v = validate()
    setErrors(v)
    console.log("Validation errors:", v)
    
    if (Object.keys(v).length > 0) {
      console.log("Form has validation errors, stopping submission")
      return
    }

    console.log("Starting registration process...")
    setSubmitting(true)
    
    try {
      // Prepare payload for backend
      const payload = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        phone_number: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: data.role,
        institute_id: data.institution.trim(), // Assuming institution name as ID for now
      }

      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL)
      console.log("Payload being sent:", payload)
      console.log("About to call register function...")

      const response = await register(payload)
      
      console.log("Registration successful:", response)
      
      // Handle successful registration
      if (onSuccess) {
        onSuccess(response.message)
      }
      
      // Reset form
      setData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        institution: "",
        role: "ATHLETE",
        password: "",
        confirmPassword: "",
      })
      
    } catch (err) {
      console.error("Registration error:", err)
      let errorMessage = "Registration failed. Please try again."
      
      if (err instanceof ApiError) {
        errorMessage = err.message
        console.error("API Error details:", { message: err.message, status: err.status })
      } else if (err instanceof Error) {
        errorMessage = err.message
        console.error("Generic Error:", err.message)
      }
      
      setErrors({ form: errorMessage })
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setSubmitting(false)
      console.log("Registration process completed")
    }
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-balance">Create your account</CardTitle>
        <CardDescription className="text-pretty">Fill in your details to get started.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="grid gap-4">
          {errors.form ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                placeholder=""
                value={data.firstName}
                onChange={handleChange}
                required
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName ? <p className="text-xs text-destructive">{errors.firstName}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                placeholder=""
                value={data.lastName}
                onChange={handleChange}
                required
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName ? <p className="text-xs text-destructive">{errors.lastName}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="+919825674567"
              value={data.phone}
              onChange={handleChange}
              required
              aria-invalid={!!errors.phone}
            />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
          </div>

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
              aria-invalid={!!errors.email}
            />
            {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              name="institution"
              placeholder="Your school or organization"
              value={data.institution}
              onChange={handleChange}
              required
              aria-invalid={!!errors.institution}
            />
            {errors.institution ? <p className="text-xs text-destructive">{errors.institution}</p> : null}
          </div>

          <fieldset className="grid gap-3 ">
            <legend className="text-sm font-medium ">Role</legend>
            <RadioGroup
              value={data.role}
              onValueChange={(v: Role) => setData((d) => ({ ...d, role: v }))}
              className="grid gap-2 mt-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="role-athlete" value="ATHLETE" className="border-2 border-gray-400 bg-white" />
                <Label htmlFor="role-athlete">Athlete</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="role-referee" value="REFEREE" className="border-2 border-gray-400 bg-white" />
                <Label htmlFor="role-referee">Referee</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="role-mgr" value="TEAM MANAGER" className="border-2 border-gray-400 bg-white" />
                <Label htmlFor="role-mgr">TEAM MANAGER</Label>
              </div>
            </RadioGroup>
          </fieldset>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                aria-invalid={!!errors.password}
              />
              {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={data.confirmPassword}
                onChange={handleChange}
                required
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword ? <p className="text-xs text-destructive">{errors.confirmPassword}</p> : null}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2 mt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
