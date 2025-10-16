import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, Trophy } from "lucide-react"

const upcomingCompetitions = [
  {
    id: 1,
    name: "National Championship",
    date: "2024-04-02",
    time: "09:00 AM",
    location: "Olympic Stadium, Capital City",
    events: ["100m Sprint", "Long Jump"],
    status: "registered",
    participants: 150,
    registrationDeadline: "2024-03-25",
  },
  {
    id: 2,
    name: "Inter-School Meet",
    date: "2024-04-15",
    time: "02:00 PM",
    location: "Springfield Sports Complex",
    events: ["100m Sprint", "200m Sprint"],
    status: "pending",
    participants: 80,
    registrationDeadline: "2024-04-08",
  },
  {
    id: 3,
    name: "Regional Qualifier",
    date: "2024-05-01",
    time: "10:30 AM",
    location: "State University Track",
    events: ["100m Sprint", "Long Jump", "4x100m Relay"],
    status: "open",
    participants: 200,
    registrationDeadline: "2024-04-20",
  },
]

export default function AthleteCompetitions() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "open":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "registered":
        return "Registered"
      case "pending":
        return "Pending Approval"
      case "open":
        return "Registration Open"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Competitions</h2>
        <p className="text-muted-foreground">View and manage your competition registrations</p>
      </div>

      <div className="grid gap-4">
        {upcomingCompetitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {competition.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Registration deadline: {new Date(competition.registrationDeadline).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(competition.status)}>{getStatusText(competition.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(competition.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.participants} participants expected</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Events</h4>
                    <div className="flex flex-wrap gap-1">
                      {competition.events.map((event, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {competition.status === "open" && <Button size="sm">Register</Button>}
                    {competition.status === "registered" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                    {competition.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Edit Registration
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
