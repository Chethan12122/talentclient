"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Trophy, TrendingUp, Calendar } from "lucide-react"

const students = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@springfield.edu",
    sport: "Track & Field",
    events: ["100m Sprint", "Long Jump"],
    year: "Senior",
    gpa: 3.8,
    personalBest: "10.85s (100m)",
    recentAchievements: ["State Champion 2023", "Regional Record"],
    status: "active",
    joinDate: "2021-09-01",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@springfield.edu",
    sport: "Swimming",
    events: ["100m Freestyle", "200m Butterfly"],
    year: "Junior",
    gpa: 3.9,
    personalBest: "54.2s (100m Free)",
    recentAchievements: ["Regional Champion 2023"],
    status: "active",
    joinDate: "2022-09-01",
  },
  {
    id: 3,
    name: "Marcus Williams",
    email: "marcus.williams@springfield.edu",
    sport: "Basketball",
    events: ["Point Guard"],
    year: "Sophomore",
    gpa: 3.6,
    personalBest: "28 PPG Average",
    recentAchievements: ["District MVP 2023"],
    status: "active",
    joinDate: "2023-09-01",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@springfield.edu",
    sport: "Tennis",
    events: ["Singles", "Doubles"],
    year: "Senior",
    gpa: 4.0,
    personalBest: "State Ranking #3",
    recentAchievements: ["State Finalist 2023", "Academic All-State"],
    status: "active",
    joinDate: "2021-09-01",
  },
  {
    id: 5,
    name: "David Park",
    email: "david.park@springfield.edu",
    sport: "Soccer",
    events: ["Midfielder"],
    year: "Junior",
    gpa: 3.7,
    personalBest: "15 Goals Season",
    recentAchievements: ["All-Conference Team"],
    status: "injured",
    joinDate: "2022-09-01",
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "lisa.thompson@springfield.edu",
    sport: "Track & Field",
    events: ["400m", "800m"],
    year: "Freshman",
    gpa: 3.5,
    personalBest: "58.2s (400m)",
    recentAchievements: ["Freshman of the Year"],
    status: "active",
    joinDate: "2024-09-01",
  },
]

export default function TeamManagerStudents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = sportFilter === "all" || student.sport === sportFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesSport && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "injured":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getYearColor = (year: string) => {
    switch (year) {
      case "Senior":
        return "bg-purple-100 text-purple-800"
      case "Junior":
        return "bg-blue-100 text-blue-800"
      case "Sophomore":
        return "bg-green-100 text-green-800"
      case "Freshman":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Athletes</h2>
          <p className="text-muted-foreground">Manage and track your institution's athletes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="Track & Field">Track & Field</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{student.name}</h3>
                      <Badge className={getYearColor(student.year)}>{student.year}</Badge>
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {student.sport}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        GPA: {student.gpa}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined: {new Date(student.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Events/Position</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.events.map((event, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Personal Best</h4>
                  <p className="text-sm text-muted-foreground">{student.personalBest}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                  <div className="space-y-1">
                    {student.recentAchievements.slice(0, 2).map((achievement, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {achievement}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
