"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Flag, Edit, Save, X, Award } from "lucide-react"

export default function RefereeProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "Michael",
    lastName: "Davis",
    email: "referee@test.com",
    phone: "+1 (555) 456-7890",
    address: "456 Sports Lane, Metro City, ST 54321",
    dateOfBirth: "1985-08-22",
    licenseNumber: "REF-2024-001234",
    licenseLevel: "Level 3 Certified",
    yearsExperience: 8,
    specializations: ["Track & Field", "Swimming", "Basketball"],
    bio: "Experienced referee with 8 years of officiating at high school and collegiate levels. Committed to fair play and maintaining the integrity of competitive sports.",
    certifications: [
      "USA Track & Field Official",
      "Swimming Officials Association",
      "Basketball Referees Association",
      "First Aid/CPR Certified",
    ],
    availability: {
      weekdays: true,
      weekends: true,
      evenings: true,
    },
    rating: 4.8,
    totalMatches: 247,
  })

  const handleSave = () => {
    // TODO: Save profile data to backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    // TODO: Reset form data
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Referee Profile</h2>
          <p className="text-muted-foreground">Manage your officiating credentials and availability</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
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
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm">{profile.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm">{profile.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              ) : (
                <p className="text-sm">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              ) : (
                <p className="text-sm">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              {isEditing ? (
                <Textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={2}
                />
              ) : (
                <p className="text-sm">{profile.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                />
              ) : (
                <p className="text-sm">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              )}
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
              <Label>License Number</Label>
              {isEditing ? (
                <Input
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                />
              ) : (
                <p className="text-sm font-mono">{profile.licenseNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>License Level</Label>
              {isEditing ? (
                <Input
                  value={profile.licenseLevel}
                  onChange={(e) => setProfile({ ...profile, licenseLevel: e.target.value })}
                />
              ) : (
                <Badge variant="secondary">{profile.licenseLevel}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Years of Experience</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({ ...profile, yearsExperience: Number.parseInt(e.target.value) })}
                />
              ) : (
                <p className="text-sm">{profile.yearsExperience} years</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm">{profile.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {profile.rating}/5.0
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total Matches</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {profile.totalMatches}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications & Credentials
          </CardTitle>
          <CardDescription>Your current officiating certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
