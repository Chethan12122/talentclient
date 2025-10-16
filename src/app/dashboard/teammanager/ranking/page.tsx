import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, TrendingDown, Minus, Medal, Award } from "lucide-react"

const institutionRankings = [
  {
    rank: 1,
    name: "Metro High School",
    points: 2850,
    change: 0,
    sports: ["Track & Field", "Swimming", "Basketball"],
    recentWins: 15,
  },
  {
    rank: 2,
    name: "Central Academy",
    points: 2720,
    change: 1,
    sports: ["Soccer", "Tennis", "Track & Field"],
    recentWins: 12,
  },
  {
    rank: 3,
    name: "Springfield High School",
    points: 2680,
    change: -1,
    sports: ["Track & Field", "Swimming", "Basketball", "Soccer", "Tennis"],
    recentWins: 11,
    isCurrentInstitution: true,
  },
  {
    rank: 4,
    name: "Riverside Prep",
    points: 2590,
    change: 2,
    sports: ["Basketball", "Soccer"],
    recentWins: 9,
  },
  {
    rank: 5,
    name: "Northside High",
    points: 2480,
    change: -1,
    sports: ["Track & Field", "Tennis"],
    recentWins: 8,
  },
]

const sportRankings = [
  {
    sport: "Track & Field",
    rank: 2,
    totalSchools: 25,
    points: 950,
    change: 1,
    topAthletes: ["Alex Johnson", "Lisa Thompson"],
    recentResults: "State Championship - 2nd Place",
  },
  {
    sport: "Swimming",
    rank: 4,
    totalSchools: 18,
    points: 720,
    change: 0,
    topAthletes: ["Sarah Chen"],
    recentResults: "Regional Meet - 1st Place",
  },
  {
    sport: "Basketball",
    rank: 6,
    totalSchools: 32,
    points: 680,
    change: -2,
    topAthletes: ["Marcus Williams"],
    recentResults: "District Tournament - Semi-Finals",
  },
  {
    sport: "Tennis",
    rank: 1,
    totalSchools: 15,
    points: 890,
    change: 0,
    topAthletes: ["Emma Rodriguez"],
    recentResults: "State Tournament - Finalist",
  },
  {
    sport: "Soccer",
    rank: 8,
    totalSchools: 28,
    points: 440,
    change: -3,
    topAthletes: ["David Park"],
    recentResults: "Conference Championship - Quarterfinals",
  },
]

const monthlyProgress = [
  { month: "Jan", points: 2420 },
  { month: "Feb", points: 2480 },
  { month: "Mar", points: 2680 },
  { month: "Apr", points: 2680 },
]

export default function TeamManagerRanking() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Institution Rankings</h2>
        <p className="text-muted-foreground">Track your institution's performance and competitive standing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#3</div>
            <p className="text-xs text-muted-foreground">Out of 45 institutions</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">Down 1 position</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,680</div>
            <p className="text-xs text-muted-foreground">Competition points</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+200 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Wins</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+3 from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Institution Rankings</CardTitle>
            <CardDescription>State-wide competitive standings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {institutionRankings.map((institution) => (
                <div
                  key={institution.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    institution.isCurrentInstitution ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(institution.rank)}
                    <div>
                      <p className={`font-medium text-sm ${institution.isCurrentInstitution ? "text-primary" : ""}`}>
                        {institution.name}
                        {institution.isCurrentInstitution && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {institution.points} points • {institution.recentWins} recent wins
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(institution.change)}
                    <span className={`text-xs ${getChangeColor(institution.change)}`}>
                      {institution.change === 0 ? "—" : Math.abs(institution.change)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sport-Specific Rankings</CardTitle>
            <CardDescription>Performance by individual sports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sportRankings.map((sport) => (
                <div key={sport.sport} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRankIcon(sport.rank)}
                      <span className="font-medium text-sm">{sport.sport}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(sport.change)}
                      <span className={`text-xs ${getChangeColor(sport.change)}`}>
                        {sport.change === 0 ? "—" : Math.abs(sport.change)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rank #{sport.rank} of {sport.totalSchools} • {sport.points} points
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Top Athletes:</span> {sport.topAthletes.join(", ")}
                  </div>
                  <div className="text-xs text-muted-foreground">{sport.recentResults}</div>
                  <Progress
                    value={((sport.totalSchools - sport.rank + 1) / sport.totalSchools) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>Points accumulation over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {monthlyProgress.map((month, index) => (
              <div key={month.month} className="text-center">
                <p className="text-sm font-medium">{month.month}</p>
                <p className="text-2xl font-bold">{month.points.toLocaleString()}</p>
                {index > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {month.points > monthlyProgress[index - 1].points ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        month.points > monthlyProgress[index - 1].points ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Math.abs(month.points - monthlyProgress[index - 1].points)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
