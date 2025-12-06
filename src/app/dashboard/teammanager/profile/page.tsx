"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, Phone, Trophy, Loader2 } from "lucide-react"
import { getUserById } from "@/services/user.api"
import { getCookie } from "cookies-next"
import type { User as UserType } from "@/types/user"

export default function TeamManagerProfile() {
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
    managerName: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
    email: userData.email || "",
    phone: userData.phone_number || "",
    institutionName: userData.institute_details?.name || "N/A",
  } : {
    managerName: "",
    email: "",
    phone: "",
    institutionName: "",
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
          <h2 className="text-2xl font-bold tracking-tight">Institution Profile</h2>
          <p className="text-muted-foreground">Your institution's information and athletic programs</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Institution Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              <p className="text-sm font-medium">{profile.institutionName}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Manager Name</Label>
              <p className="text-sm">{profile.managerName}</p>
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
              <Trophy className="h-5 w-5" />
              Athletic Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Institution Information</Label>
              <p className="text-sm">Connected to: {profile.institutionName}</p>
            </div>

            {userData?.institute_details && (
              <div className="space-y-2">
                <Label>Institution Details</Label>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Institution ID:</span> {userData.institute_details.institute_id}</p>
                  <p><span className="font-medium">District ID:</span> {userData.institute_details.district_id}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Game Categories</Label>
              <div className="flex flex-wrap gap-2">
                {userData?.game_categories && userData.game_categories.length > 0 ? (
                  userData.game_categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No game categories listed</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
