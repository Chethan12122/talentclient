import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Medal, Award } from "lucide-react"

const competitionHistory = [
  {
    id: 1,
    name: "Regional Championship",
    date: "2024-03-15",
    location: "Metro Sports Arena",
    events: [
      { name: "100m Sprint", result: "1st Place", time: "10.85s", points: 950 },
      { name: "Long Jump", result: "2nd Place", distance: "7.15m", points: 880 },
    ],
    overallRank: 1,
    totalPoints: 1830,
    medal: "gold",
  },
  {
    id: 2,
    name: "State Qualifier",
    date: "2024-03-08",
    location: "University Stadium",
    events: [
      { name: "100m Sprint", result: "2nd Place", time: "10.92s", points: 920 },
      { name: "200m Sprint", result: "3rd Place", time: "21.45s", points: 850 },
    ],
    overallRank: 2,
    totalPoints: 1770,
    medal: "silver",
  },
  {
    id: 3,
    name: "District Meet",
    date: "2024-02-20",
    location: "Central High School",
    events: [
      { name: "100m Sprint", result: "1st Place", time: "10.88s", points: 940 },
      { name: "Long Jump", result: "1st Place", distance: "7.20m", points: 900 },
      { name: "4x100m Relay", result: "1st Place", time: "42.15s", points: 880 },
    ],
    overallRank: 1,
    totalPoints: 2720,
    medal: "gold",
  },
  {
    id: 4,
    name: "Winter Indoor Championship",
    date: "2024-01-25",
    location: "Indoor Athletic Center",
    events: [
      { name: "60m Sprint", result: "3rd Place", time: "7.12s", points: 820 },
      { name: "Long Jump", result: "4th Place", distance: "6.95m", points: 780 },
    ],
    overallRank: 4,
    totalPoints: 1600,
    medal: "bronze",
  },
]

export default function AthleteHistory() {
  const getMedalIcon = (medal: string) => {
    switch (medal) {
      case "gold":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "silver":
        return <Medal className="h-4 w-4 text-gray-400" />
      case "bronze":
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return null
    }
  }

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "bronze":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResultColor = (result: string) => {
    if (result.includes("1st")) return "text-yellow-600 font-semibold"
    if (result.includes("2nd")) return "text-gray-600 font-semibold"
    if (result.includes("3rd")) return "text-amber-600 font-semibold"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Competition History</h2>
        <p className="text-muted-foreground">Your past competition results and achievements</p>
      </div>

      <div className="grid gap-4">
        {competitionHistory.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getMedalIcon(competition.medal)}
                    {competition.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(competition.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {competition.location}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className={getMedalColor(competition.medal)}>
                    {competition.overallRank === 1
                      ? "1st Place"
                      : competition.overallRank === 2
                        ? "2nd Place"
                        : competition.overallRank === 3
                          ? "3rd Place"
                          : `${competition.overallRank}th Place`}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{competition.totalPoints} points</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Event Results</h4>
                <div className="grid gap-2">
                  {competition.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{event.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.time && `Time: ${event.time}`}
                          {event.distance && `Distance: ${event.distance}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${getResultColor(event.result)}`}>{event.result}</p>
                        <p className="text-xs text-muted-foreground">{event.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
