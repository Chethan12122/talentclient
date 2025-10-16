"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPlayerById } from "@/lib/api"
import { useEventStore } from "@/components/store/use-event-store";
import { QRScanner } from "@/components/qr-scanner"
import { RosterList } from "@/components/roster-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, QrCode, Users } from "lucide-react"

export default function ScanPage() {
  const router = useRouter()
  const event = useEventStore((s) => s.event)
  const addPlayer = useEventStore((s) => s.addPlayer)
  const removePlayer = useEventStore((s) => s.removePlayer)
  const roster = useEventStore((s) => s.roster)

  const [detectedId, setDetectedId] = useState<string | null>(null)
  const [pendingName, setPendingName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!event) {
      router.replace("/dashboard/referee/events")
    }
  }, [event, router])

  async function handleDetected(text: string) {
    if (loading) return
    setDetectedId(text)
    setLoading(true)
    try {
      const p = await fetchPlayerById(text)
      setPendingName(p.name)
    } catch (error) {
      console.error("Error fetching player:", error)
      setPendingName(null)
      alert("Failed to fetch player information")
    } finally {
      setLoading(false)
    }
  }

  function onAdd() {
    if (!detectedId || !pendingName) return
    addPlayer({ id: detectedId, name: pendingName })
    setDetectedId(null)
    setPendingName(null)
  }

  const canStart = roster.length > 0

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading event data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scan Athletes</h2>
          <p className="text-muted-foreground">
            {event.discipline} ({event.type})
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/referee/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Scanner
              </CardTitle>
              <CardDescription>Point the camera at an athlete's QR code or paste the ID below</CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner onDetected={handleDetected} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detected Athlete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Athlete ID</div>
                <div className="font-mono text-sm rounded-md bg-muted px-3 py-2">
                  {detectedId || "—"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm rounded-md bg-muted px-3 py-2">
                  {loading ? "Loading..." : pendingName || "—"}
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!detectedId || !pendingName || loading}
                onClick={onAdd}
              >
                Add to Roster
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Event Roster ({roster.length})
              </CardTitle>
              <CardDescription>Athletes registered for this event</CardDescription>
            </CardHeader>
            <CardContent>
              <RosterList players={roster} onRemove={removePlayer} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {canStart
                  ? `${roster.length} athlete${roster.length > 1 ? "s" : ""} registered. You can add more or proceed to record results.`
                  : "Add at least one athlete to start recording results."}
              </p>
              <Button
                className="w-full"
                disabled={!canStart}
                onClick={() => router.push("/dashboard/referee/events/trials")}
              >
                Start Recording Results
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
