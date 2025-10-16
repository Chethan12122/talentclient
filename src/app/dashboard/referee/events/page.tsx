"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEventStore } from "@/components/store/use-event-store"
import { Flag, Users, Timer, Loader2 } from "lucide-react"
import { getCookie } from "cookies-next"

export default function EventsPage() {
  const router = useRouter()
  const setEvent = useEventStore((s) => s.setEvent)
  const clearStore = useEventStore((s) => s.clearStore)

  const [discipline, setDiscipline] = useState<string>("")
  const [eventType, setEventType] = useState<"Race" | "Field" | "">("")
  const [loading, setLoading] = useState(false)

  const disciplines = {
    Race: ["100m Sprint", "200m Sprint", "400m Sprint", "800m Run", "1500m Run", "4x100m Relay", "4x400m Relay"],
    Field: ["Long Jump", "High Jump", "Triple Jump", "Shot Put", "Discus Throw", "Javelin Throw", "Pole Vault"]
  }

  const handleStartEvent = async () => {
    if (!discipline || !eventType) {
      alert("Please select both discipline and event type")
      return
    }

    setLoading(true)
    
    try {
      // Get referee email from cookie or session
      const userEmailCookie = getCookie("user_email")
      const userEmail = typeof userEmailCookie === 'string' ? userEmailCookie : "referee@example.com"
      
      // Create event with temporary ID and email
      // This creates a properly typed CreatedEvent
      const newEvent = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: userEmail,
        discipline,
        type: eventType as "Race" | "Field"
      }

      clearStore()
      setEvent(newEvent)

      router.push("/dashboard/referee/events/scan")
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Event Management</h2>
        <p className="text-muted-foreground">Create and manage athletic events</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Create New Event
            </CardTitle>
            <CardDescription>Set up a new athletic event to record results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => {
                setEventType(value as "Race" | "Field")
                setDiscipline("")
              }}>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Race">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Race (Track)
                    </div>
                  </SelectItem>
                  <SelectItem value="Field">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Field Event
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventType && (
              <div className="space-y-3">
                <Label htmlFor="discipline">Discipline</Label>
                <Select value={discipline} onValueChange={setDiscipline}>
                  <SelectTrigger id="discipline">
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines[eventType]?.map((disc) => (
                      <SelectItem key={disc} value={disc}>
                        {disc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleStartEvent}
              disabled={!discipline || !eventType || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Start Event"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Instructions</CardTitle>
            <CardDescription>How to manage events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  1
                </div>
                <p className="text-sm">Select the event type (Race or Field event)</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  2
                </div>
                <p className="text-sm">Choose the specific discipline</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  3
                </div>
                <p className="text-sm">Scan athlete QR codes to build your roster</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  4
                </div>
                <p className="text-sm">Record results for each athlete</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  5
                </div>
                <p className="text-sm">Submit all results when complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Timer className="h-5 w-5 text-blue-500" />
                Race Events
              </div>
              <p className="text-sm text-muted-foreground">
                Track events with single time recording per athlete
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Sprint: 100m, 200m, 400m</li>
                <li>• Middle Distance: 800m, 1500m</li>
                <li>• Relays: 4x100m, 4x400m</li>
                <li>• 1 attempt per athlete</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Users className="h-5 w-5 text-green-500" />
                Field Events
              </div>
              <p className="text-sm text-muted-foreground">
                Field events with three attempts per athlete
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Jumps: Long, High, Triple, Pole Vault</li>
                <li>• Throws: Shot Put, Discus, Javelin</li>
                <li>• 3 attempts per athlete</li>
                <li>• Best of 3 attempts recorded</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
