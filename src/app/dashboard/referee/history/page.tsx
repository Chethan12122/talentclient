import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Flag, Star, IndianRupee } from "lucide-react"

const matchHistory = [
  {
    id: 1,
    event: "Regional Semi-Final",
    sport: "Track & Field",
    date: "2024-03-20",
    location: "Metro Stadium",
    duration: "3.5 hours",
    role: "Head Official",
    teams: ["Springfield High", "Central Academy"],
    payment: "740",
    rating: 5.0,
    feedback: "Excellent officiating throughout the event. Professional and decisive.",
    status: "completed",
    incidents: 0,
  },
  {
    id: 2,
    event: "District Championship",
    sport: "Swimming",
    date: "2024-03-18",
    location: "Aquatic Center",
    duration: "4 hours",
    role: "Stroke Judge",
    teams: ["Multiple Schools"],
    payment: "720",
    rating: 4.8,
    feedback: "Great attention to detail. Caught several technical violations.",
    status: "completed",
    incidents: 2,
  },
  {
    id: 3,
    event: "Basketball Playoff",
    sport: "Basketball",
    date: "2024-03-15",
    location: "High School Gym",
    duration: "2 hours",
    role: "Lead Referee",
    teams: ["Eagles vs Hawks"],
    payment: "800",
    rating: 4.9,
    feedback: "Maintained control of a heated game. Fair and consistent calls.",
    status: "completed",
    incidents: 1,
  },
  {
    id: 4,
    event: "Track & Field Invitational",
    sport: "Track & Field",
    date: "2024-03-10",
    location: "University Track",
    duration: "5 hours",
    role: "Field Judge",
    teams: ["Multiple Schools"],
    payment: "660",
    rating: 4.7,
    feedback: "Handled field events professionally. Good communication with athletes.",
    status: "completed",
    incidents: 0,
  },
  {
    id: 5,
    event: "Swimming Qualifier",
    sport: "Swimming",
    date: "2024-03-05",
    location: "Community Pool",
    duration: "3 hours",
    role: "Timer",
    teams: ["Riverside Prep", "Northside High"],
    payment: "570",
    rating: 4.6,
    feedback: "Accurate timing and good coordination with other officials.",
    status: "completed",
    incidents: 0,
  },
  {
    id: 6,
    event: "Basketball Tournament",
    sport: "Basketball",
    date: "2024-02-28",
    location: "Sports Complex",
    duration: "2.5 hours",
    role: "Assistant Referee",
    teams: ["Lions vs Tigers"],
    payment: "480",
    rating: 4.8,
    feedback: "Solid performance. Good positioning and awareness.",
    status: "completed",
    incidents: 0,
  },
]

const monthlyStats = {
  totalMatches: 6,
  totalHours: 20,
  totalEarnings: 690,
  averageRating: 4.8,
  totalIncidents: 3,
}

export default function RefereeHistory() {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return "text-green-600"
    if (rating >= 4.5) return "text-blue-600"
    if (rating >= 4.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getIncidentColor = (incidents: number) => {
    if (incidents === 0) return "text-green-600"
    if (incidents <= 2) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Match History</h2>
        <p className="text-muted-foreground">Your completed officiating assignments and performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.totalHours}</div>
            <p className="text-xs text-muted-foreground">total hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">total reported</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {matchHistory.map((match) => (
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
                      {match.duration}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className={`font-semibold ${getRatingColor(match.rating)}`}>{match.rating}</span>
                  </div>
                  <Badge variant="secondary">{match.payment}</Badge>
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
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span>Role: {match.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Teams:</span>
                    <span>{Array.isArray(match.teams) ? match.teams.join(" vs ") : match.teams}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Incidents:</span>
                    <span className={getIncidentColor(match.incidents)}>
                      {match.incidents === 0 ? "None" : match.incidents}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {match.feedback && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm">
                        <strong className="text-muted-foreground">Feedback:</strong>
                      </p>
                      <p className="text-sm mt-1">{match.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
