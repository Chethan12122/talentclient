import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Trophy, Target } from "lucide-react"

const upcomingCompetitions = [
  {
    id: 1,
    name: "Inter-School Championship",
    date: "2024-04-10",
    location: "State Athletic Complex",
    sports: ["Track & Field", "Swimming"],
    registeredAthletes: 23,
    totalSlots: 30,
    registrationDeadline: "2024-04-03",
    status: "open",
    expectedResults: "High medal potential",
  },
  {
    id: 2,
    name: "District Tournament",
    date: "2024-04-25",
    location: "Regional Sports Center",
    sports: ["Basketball", "Soccer"],
    registeredAthletes: 15,
    totalSlots: 20,
    registrationDeadline: "2024-04-18",
    status: "open",
    expectedResults: "Strong contenders",
  },
  {
    id: 3,
    name: "State Tennis Championship",
    date: "2024-05-08",
    location: "University Tennis Courts",
    sports: ["Tennis"],
    registeredAthletes: 4,
    totalSlots: 6,
    registrationDeadline: "2024-05-01",
    status: "open",
    expectedResults: "Medal favorites",
  },
]

const recentResults = [
  {
    id: 1,
    name: "Regional Track Meet",
    date: "2024-03-20",
    location: "Metro Stadium",
    results: {
      gold: 3,
      silver: 2,
      bronze: 1,
      totalPoints: 450,
    },
    participants: 18,
    highlights: ["Alex Johnson - 100m State Record", "Lisa Thompson - Long Jump 1st"],
  },
  {
    id: 2,
    name: "Swimming Championships",
    date: "2024-03-15",
    location: "Aquatic Center",
    results: {
      gold: 1,
      silver: 3,
      bronze: 2,
      totalPoints: 320,
    },
    participants: 8,
    highlights: ["Sarah Chen - 100m Freestyle 2nd", "Team Relay - 3rd Place"],
  },
  {
    id: 3,
    name: "Basketball District Finals",
    date: "2024-03-08",
    location: "High School Gymnasium",
    results: {
      gold: 0,
      silver: 1,
      bronze: 0,
      totalPoints: 180,
    },
    participants: 12,
    highlights: ["Marcus Williams - Tournament MVP", "Team - Runner-up"],
  },
]

const teamPerformance = [
  {
    sport: "Track & Field",
    athletes: 12,
    competitions: 4,
    medals: { gold: 5, silver: 3, bronze: 2 },
    points: 890,
    trend: "up",
  },
  {
    sport: "Swimming",
    athletes: 6,
    competitions: 3,
    medals: { gold: 2, silver: 4, bronze: 3 },
    points: 650,
    trend: "up",
  },
  {
    sport: "Basketball",
    athletes: 8,
    competitions: 2,
    medals: { gold: 0, silver: 1, bronze: 1 },
    points: 320,
    trend: "down",
  },
  {
    sport: "Tennis",
    athletes: 4,
    competitions: 2,
    medals: { gold: 1, silver: 1, bronze: 0 },
    points: 480,
    trend: "up",
  },
  {
    sport: "Soccer",
    athletes: 11,
    competitions: 2,
    medals: { gold: 0, silver: 0, bronze: 1 },
    points: 150,
    trend: "down",
  },
]

export default function TeamManagerCompetitions() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Competitions</h2>
        <p className="text-muted-foreground">Manage competition registrations and track team performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Competitions
            </CardTitle>
            <CardDescription>Register your athletes for upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCompetitions.map((competition) => (
                <div key={competition.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{competition.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(competition.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {competition.location}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(competition.status)}>{competition.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Registered Athletes</span>
                      <span className="font-medium">
                        {competition.registeredAthletes}/{competition.totalSlots}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {competition.sports.map((sport, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registration deadline: {new Date(competition.registrationDeadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-medium text-primary">{competition.expectedResults}</p>
                    <Button size="sm" className="w-full mt-2">
                      Manage Registration
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Latest competition outcomes and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {result.participants} athletes
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{result.results.totalPoints} pts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>{result.results.gold}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>{result.results.silver}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                      <span>{result.results.bronze}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {result.highlights.map((highlight, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Team Performance by Sport
          </CardTitle>
          <CardDescription>Overview of each sport's competitive performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamPerformance.map((sport) => (
              <div key={sport.sport} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{sport.sport}</h4>
                  <Badge variant="outline" className={getTrendColor(sport.trend)}>
                    {sport.trend === "up" ? "↗" : "↘"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Athletes</span>
                    <span className="font-medium">{sport.athletes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Competitions</span>
                    <span className="font-medium">{sport.competitions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Points</span>
                    <span className="font-medium">{sport.points}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{sport.medals.gold}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{sport.medals.silver}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span>{sport.medals.bronze}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
