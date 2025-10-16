"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Trophy, Edit, Save, X } from "lucide-react"

export default function AthleteProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "athlete@test.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1998-05-15",
    institution: "Springfield High School",
    sport: "Track & Field",
    specialization: "100m Sprint, Long Jump",
    bio: "Passionate sprinter with 5 years of competitive experience. Currently training for state championships and aiming for college scholarships.",
    achievements: ["State Champion 2023", "Regional Record Holder", "All-State Team 2022"],
    personalBests: {
      "100m Sprint": "10.85s",
      "Long Jump": "7.2m",
      "200m Sprint": "21.45s",
    },
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
          <h2 className="text-2xl font-bold tracking-tight">Athlete Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and athletic details</p>
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Institution
              </Label>
              {isEditing ? (
                <Input
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                />
              ) : (
                <p className="text-sm">{profile.institution}</p>
              )}
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
              <Label>Sport</Label>
              {isEditing ? (
                <Input value={profile.sport} onChange={(e) => setProfile({ ...profile, sport: e.target.value })} />
              ) : (
                <p className="text-sm">{profile.sport}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              {isEditing ? (
                <Input
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                />
              ) : (
                <p className="text-sm">{profile.specialization}</p>
              )}
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

            <div className="space-y-2">
              <Label>Personal Bests</Label>
              <div className="space-y-2">
                {Object.entries(profile.personalBests).map(([event, time]) => (
                  <div key={event} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{event}</span>
                    <Badge variant="secondary">{time}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your notable accomplishments and awards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.achievements.map((achievement, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {achievement}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
