"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, Phone, MapPin, Users, Trophy, Edit, Save, X, Calendar } from "lucide-react"

export default function TeamManagerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    institutionName: "Springfield High School",
    managerName: "Coach Sarah Williams",
    email: "manager@test.com",
    phone: "+1 (555) 987-6543",
    address: "123 Education Ave, Springfield, ST 12345",
    established: "1985",
    totalStudents: 1200,
    activeAthletes: 89,
    sportsPrograms: ["Track & Field", "Swimming", "Basketball", "Soccer", "Tennis"],
    description:
      "Springfield High School has been a leader in athletic excellence for over 35 years. Our comprehensive sports program develops student-athletes both on and off the field.",
    achievements: [
      "State Champions 2023 - Track & Field",
      "Regional Champions 2022 - Swimming",
      "District Champions 2023 - Basketball",
    ],
    facilities: [
      "400m Athletic Track",
      "Olympic-size Swimming Pool",
      "2 Basketball Courts",
      "Soccer Field",
      "Tennis Courts (4)",
    ],
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
          <h2 className="text-2xl font-bold tracking-tight">Institution Profile</h2>
          <p className="text-muted-foreground">Manage your institution's information and athletic programs</p>
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
              <Building className="h-5 w-5" />
              Institution Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              {isEditing ? (
                <Input
                  id="institutionName"
                  value={profile.institutionName}
                  onChange={(e) => setProfile({ ...profile, institutionName: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium">{profile.institutionName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Manager Name</Label>
              {isEditing ? (
                <Input
                  id="managerName"
                  value={profile.managerName}
                  onChange={(e) => setProfile({ ...profile, managerName: e.target.value })}
                />
              ) : (
                <p className="text-sm">{profile.managerName}</p>
              )}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Established
                </Label>
                {isEditing ? (
                  <Input
                    value={profile.established}
                    onChange={(e) => setProfile({ ...profile, established: e.target.value })}
                  />
                ) : (
                  <p className="text-sm">{profile.established}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Students
                </Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={profile.totalStudents}
                    onChange={(e) => setProfile({ ...profile, totalStudents: Number.parseInt(e.target.value) })}
                  />
                ) : (
                  <p className="text-sm">{profile.totalStudents.toLocaleString()}</p>
                )}
              </div>
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
              <Label>Description</Label>
              {isEditing ? (
                <Textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm">{profile.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Active Athletes</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {profile.activeAthletes}
                </Badge>
                <span className="text-sm text-muted-foreground">currently competing</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sports Programs</Label>
              <div className="flex flex-wrap gap-2">
                {profile.sportsPrograms.map((sport, index) => (
                  <Badge key={index} variant="outline">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Facilities</Label>
              <div className="space-y-1">
                {profile.facilities.map((facility, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {facility}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Institution's notable accomplishments and awards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {profile.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
