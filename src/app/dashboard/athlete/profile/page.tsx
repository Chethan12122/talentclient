"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Trophy, Loader2 } from "lucide-react"
import { getUserById } from "@/services/user.api"
import { getCookie } from "cookies-next"
import type { User as UserType } from "@/types/user"

export default function AthleteProfile() {
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
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    email: userData.email || "",
    phone: userData.phone_number || "",
    institution: userData.institute_details?.name || "N/A",
    sport: userData.game_categories?.join(", ") || "N/A",
  } : {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    sport: "",
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
          <h2 className="text-2xl font-bold tracking-tight">Athlete Profile</h2>
          <p className="text-muted-foreground">Your personal information and athletic details</p>
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Institution
              </Label>
              <p className="text-sm">{profile.institution}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Athletic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Game Categories</Label>
              <p className="text-sm">{profile.sport}</p>
            </div>
          </CardContent>
        </Card>
      </div>


      {userData?.scanner_code_url && (
  <Card>
    <CardHeader>
      <CardTitle>Scanner QR Code</CardTitle>
      <CardDescription>Your unique athlete QR code</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center gap-4">
      <img
        src={userData.scanner_code_url}
        alt="Scanner QR Code"
        className="h-40 w-40 object-contain"
      />
      <a
        href={userData.scanner_code_url}
        download={`scanner_${userData.user_id}.png`}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download QR Code
      </a>
    </CardContent>
  </Card>
)}


      {userData?.extra_user_details && userData.extra_user_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Records</CardTitle>
            <CardDescription>Your athletic performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {userData.extra_user_details.map((detail, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{detail.sport}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>{" "}
                      {new Date(detail.date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span> {detail.age}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Height:</span> {detail.height} cm
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span> {detail.weight} kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
