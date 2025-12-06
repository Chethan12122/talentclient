"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Flag, Loader2 } from "lucide-react"
import { getUserById } from "@/services/user.api"
import { getCookie } from "cookies-next"
import type { User as UserType } from "@/types/user"

export default function RefereeProfile() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserType | null>(null)
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = getCookie("user_id") as string
        const accessToken = getCookie("access_token") as string
        
        console.log("Profile fetch - User ID:", userId)
        console.log("Profile fetch - Access Token exists:", !!accessToken)
        
        if (!userId) {
          console.error("No user ID found")
          setLoading(false)
          return
        }
        
        if (!accessToken) {
          console.error("No access token found - user needs to login")
          // Redirect to login if no token
          window.location.href = '/authpage/login'
          return
        }
        
        const response = await getUserById(userId)
        if (response.data && response.data.length > 0) {
          setUserData(response.data[0])
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [])
  
  const profile = userData ? {
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    email: userData.email || "",
    phone: userData.phone_number || "",
    specializations: userData.game_categories || [],
  } : {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specializations: [],
  }


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Referee Profile</h2>
          <p className="text-muted-foreground">Your officiating credentials and information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <p className="text-sm">{profile.firstName}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <p className="text-sm">{profile.lastName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <p className="text-sm">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <p className="text-sm">{profile.phone}</p>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Officiating Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Game Categories</Label>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
                {profile.specializations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No specializations listed</p>
                )}
              </div>
            </div>

            {userData && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matches Officiated</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {userData.matches_officiated || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

