import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Flag, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const pendingAssignments = [
  {
    id: 1,
    event: "State Championship Final",
    sport: "Track & Field",
    date: "2024-05-15",
    time: "10:00 AM",
    location: "Olympic Stadium",
    role: "Head Official",
    payment: "$200",
    deadline: "2024-04-20",
    priority: "high",
    requirements: ["Level 3 Certification", "Championship Experience"],
    description: "State championship final with expected 500+ participants",
  },
  {
    id: 2,
    event: "Regional Swimming Meet",
    sport: "Swimming",
    date: "2024-04-30",
    time: "1:00 PM",
    location: "Aquatic Center",
    role: "Stroke Judge",
    payment: "$120",
    deadline: "2024-04-25",
    priority: "medium",
    requirements: ["Swimming Official Certification"],
    description: "Multi-school regional qualifying event",
  },
  {
    id: 3,
    event: "Basketball Tournament",
    sport: "Basketball",
    date: "2024-05-08",
    time: "6:00 PM",
    location: "Sports Complex",
    role: "Lead Referee",
    payment: "$130",
    deadline: "2024-05-01",
    priority: "medium",
    requirements: ["Basketball Referee License"],
    description: "District tournament semi-final game",
  },
]

const assignmentRequests = [
  {
    id: 1,
    event: "Junior Track Meet",
    sport: "Track & Field",
    date: "2024-04-18",
    time: "3:00 PM",
    location: "High School Track",
    role: "Field Judge",
    payment: "$80",
    status: "pending",
    requestedDate: "2024-03-25",
  },
  {
    id: 2,
    event: "Swimming Qualifier",
    sport: "Swimming",
    date: "2024-04-22",
    time: "11:00 AM",
    location: "Community Pool",
    role: "Timer",
    payment: "$70",
    status: "approved",
    requestedDate: "2024-03-20",
  },
  {
    id: 3,
    event: "Basketball Playoff",
    sport: "Basketball",
    date: "2024-04-28",
    time: "7:30 PM",
    location: "School Gymnasium",
    role: "Assistant Referee",
    payment: "$90",
    status: "declined",
    requestedDate: "2024-03-18",
    declineReason: "Schedule conflict",
  },
]

export default function RefereeAssignments() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "declined":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const isDeadlineNear = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
        <p className="text-muted-foreground">Manage your officiating assignments and requests</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Assignments
            </CardTitle>
            <CardDescription>New assignment offers requiring your response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {assignment.event}
                        {isDeadlineNear(assignment.deadline) && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline">{assignment.sport}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(assignment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {assignment.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                      <Badge variant="secondary">{assignment.payment}</Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span>Role: {assignment.role}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span
                          className={isDeadlineNear(assignment.deadline) ? "text-red-600 font-medium ml-1" : "ml-1"}
                        >
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Requirements</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Accept Assignment</Button>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm" variant="ghost">
                      View Details
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
              <Flag className="h-5 w-5" />
              Assignment Requests
            </CardTitle>
            <CardDescription>Your submitted requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignmentRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{request.event}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline">{request.sport}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <Badge variant="secondary">{request.payment}</Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span>Role: {request.role}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Requested:</span>
                        <span className="ml-1">{new Date(request.requestedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      {request.status === "declined" && request.declineReason && (
                        <div className="p-2 rounded bg-red-50 border border-red-200">
                          <p className="text-sm text-red-800">
                            <strong>Decline Reason:</strong> {request.declineReason}
                          </p>
                        </div>
                      )}
                      {request.status === "approved" && (
                        <div className="p-2 rounded bg-green-50 border border-green-200">
                          <p className="text-sm text-green-800">
                            <strong>Status:</strong> Assignment confirmed
                          </p>
                        </div>
                      )}
                      {request.status === "pending" && (
                        <div className="p-2 rounded bg-yellow-50 border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>Status:</strong> Awaiting response
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
