import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, Flag, AlertCircle } from "lucide-react"

const upcomingMatches = [
  {
    id: 1,
    event: "State Final Championship",
    sport: "Track & Field",
    date: "2024-03-28",
    time: "10:00 AM",
    duration: "4 hours",
    location: "Olympic Stadium, Capital City",
    teams: ["Metro High School", "Central Academy"],
    role: "Head Official",
    payment: "$150",
    status: "confirmed",
    priority: "high",
    notes: "Championship final - expect large crowd",
  },
  {
    id: 2,
    event: "Inter-School Swimming Meet",
    sport: "Swimming",
    date: "2024-04-05",
    time: "2:00 PM",
    duration: "3 hours",
    location: "Aquatic Center, Metro City",
    teams: ["Springfield High", "Riverside Prep", "Northside High"],
    role: "Stroke Judge",
    payment: "$100",
    status: "confirmed",
    priority: "medium",
    notes: "Multi-school event with 150+ participants",
  },
  {
    id: 3,
    event: "District Basketball Tournament",
    sport: "Basketball",
    date: "2024-04-12",
    time: "7:00 PM",
    duration: "2.5 hours",
    location: "High School Gymnasium",
    teams: ["Eagles vs Hawks"],
    role: "Lead Referee",
    payment: "$120",
    status: "pending",
    priority: "medium",
    notes: "Semi-final game - playoff atmosphere",
  },
  {
    id: 4,
    event: "Regional Track Qualifier",
    sport: "Track & Field",
    date: "2024-04-20",
    time: "9:00 AM",
    duration: "6 hours",
    location: "University Track Complex",
    teams: ["Multiple Schools"],
    role: "Field Judge",
    payment: "$180",
    status: "pending",
    priority: "high",
    notes: "Qualifier for state championships",
  },
]

export default function RefereeMatches() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") {
      return <AlertCircle className="h-3 w-3" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Matches</h2>
        <p className="text-muted-foreground">Your scheduled officiating assignments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">matches scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">total assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Earnings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$550</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {upcomingMatches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    {match.event}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">{match.sport}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(match.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {match.time}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(match.priority)}>
                    {getPriorityIcon(match.priority)}
                    {match.priority}
                  </Badge>
                  <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Duration: {match.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{Array.isArray(match.teams) ? match.teams.join(" vs ") : match.teams}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span>Role: {match.role}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment</span>
                    <span className="font-semibold text-green-600">{match.payment}</span>
                  </div>
                  {match.notes && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {match.notes}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {match.status === "pending" && (
                      <>
                        <Button size="sm" variant="default">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                      </>
                    )}
                    {match.status === "confirmed" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
