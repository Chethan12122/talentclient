import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, Target, TrendingUp, Calendar } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "State Champion 2023",
    description: "Won 1st place in 100m Sprint at State Championship",
    date: "2023-05-15",
    type: "championship",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    id: 2,
    title: "Regional Record Holder",
    description: "Set new regional record in 100m Sprint (10.85s)",
    date: "2024-03-15",
    type: "record",
    icon: Target,
    color: "text-red-500",
  },
  {
    id: 3,
    title: "All-State Team 2022",
    description: "Selected for All-State Track & Field Team",
    date: "2022-06-10",
    type: "selection",
    icon: Award,
    color: "text-blue-500",
  },
  {
    id: 4,
    title: "Most Improved Athlete",
    description: "Awarded for significant performance improvement",
    date: "2023-12-01",
    type: "improvement",
    icon: TrendingUp,
    color: "text-green-500",
  },
]

const personalBests = [
  {
    event: "100m Sprint",
    current: "10.85s",
    previous: "11.20s",
    improvement: "0.35s",
    target: "10.70s",
    progress: 75,
  },
  {
    event: "200m Sprint",
    current: "21.45s",
    previous: "22.10s",
    improvement: "0.65s",
    target: "21.20s",
    progress: 60,
  },
  {
    event: "Long Jump",
    current: "7.20m",
    previous: "6.85m",
    improvement: "0.35m",
    target: "7.50m",
    progress: 85,
  },
]

const goals = [
  {
    title: "Break 10.80s in 100m Sprint",
    deadline: "2024-06-01",
    progress: 75,
    status: "in-progress",
  },
  {
    title: "Qualify for National Championship",
    deadline: "2024-05-15",
    progress: 90,
    status: "in-progress",
  },
  {
    title: "Achieve 7.30m in Long Jump",
    deadline: "2024-07-01",
    progress: 45,
    status: "in-progress",
  },
]

export default function AthleteAchievements() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "championship":
        return "bg-yellow-100 text-yellow-800"
      case "record":
        return "bg-red-100 text-red-800"
      case "selection":
        return "bg-blue-100 text-blue-800"
      case "improvement":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Achievements & Goals</h2>
        <p className="text-muted-foreground">Track your accomplishments and progress towards your goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your notable accomplishments and awards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${achievement.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <Badge variant="outline" className={getTypeColor(achievement.type)}>
                          {achievement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Goals
            </CardTitle>
            <CardDescription>Your active training and competition goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Personal Bests
          </CardTitle>
          <CardDescription>Your best performances and improvement tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {personalBests.map((pb, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <h4 className="font-medium text-sm mb-3">{pb.event}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Best</span>
                    <span className="font-semibold">{pb.current}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Previous</span>
                    <span>{pb.previous}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Improvement</span>
                    <span className="text-green-600 font-medium">-{pb.improvement}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">{pb.target}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress to Target</span>
                      <span>{pb.progress}%</span>
                    </div>
                    <Progress value={pb.progress} className="h-1.5" />
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
