"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { submitEvent } from "@/lib/api"
import { useEventStore } from "@/components/store/use-event-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Save, Send } from "lucide-react"

export default function TrialsPage() {
  const router = useRouter()
  const event = useEventStore((s) => s.event)
  const roster = useEventStore((s) => s.roster)
  const currentRound = useEventStore((s) => s.currentRound)
  const activePlayerIndex = useEventStore((s) => s.activePlayerIndex)
  const setTrialValue = useEventStore((s) => s.setTrialValue)
  const saveCurrentAttempt = useEventStore((s) => s.saveCurrentAttempt)
  const nextPlayer = useEventStore((s) => s.nextPlayer)
  const prevPlayer = useEventStore((s) => s.prevPlayer)
  const isEventComplete = useEventStore((s) => s.isEventComplete)
  const trials = useEventStore((s) => s.trials)

  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const player = roster[activePlayerIndex]

  // Guard: return early if event not loaded yet
  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Loading event data...</p>
      </main>
    )
  }

  const previousAttempts = useMemo(() => {
    if (!player) return []
    if (event.type === "Race") {
      const v = trials[1]?.[player.id]?.value || ""
      return v ? [{ round: 1, value: v }] : []
    }
    // Field - show all previous rounds
    const arr: { round: number; value: string }[] = []
    for (let r = 1; r < currentRound; r++) {
      const v = trials[r]?.[player.id]?.value
      if (v) arr.push({ round: r, value: v })
    }
    return arr
  }, [player, trials, currentRound, event?.type])

  const currentValue = player ? (trials[currentRound]?.[player.id]?.value ?? "") : ""

  async function handleSaveAttempt() {
    saveCurrentAttempt()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  async function onSubmitAll() {
    if (!event) {
      alert("No event data available.")
      return
    }

    setSubmitting(true)
    try {
      const res = await submitEvent({ event, roster, trials })
      alert(`Event submitted successfully! ${res.submittedAt}`)
      router.push("/dashboard/referee/events")
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to submit event. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const allDone = isEventComplete()
  const roundLabel = event.type === "Field" ? `Round ${currentRound} of 3` : "Race Time"
  
  // Determine how many attempts to show based on event type
  const attemptsToShow = event.type === "Race" ? [1] : [1, 2, 3]

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{event.discipline}</h2>
          <p className="text-muted-foreground">{roundLabel}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/referee/events/scan")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roster
        </Button>
      </div>

      {player ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{player.name}</CardTitle>
                  <Badge variant="secondary">
                    Athlete {activePlayerIndex + 1} of {roster.length}
                  </Badge>
                </div>
                <CardDescription>Recording results for current athlete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="result">Enter Result</Label>
                  <Input
                    id="result"
                    type="text"
                    inputMode="decimal"
                    className="text-lg text-center"
                    placeholder={event.type === "Race" ? "mm:ss.ms" : "0.00"}
                    value={currentValue}
                    onChange={(e) => setTrialValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {event.type === "Race" 
                      ? "Format: minutes:seconds.milliseconds" 
                      : "Enter distance or height in meters"}
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSaveAttempt}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Attempt
                </Button>

                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center text-sm flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Attempt saved successfully!
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={prevPlayer}
                  disabled={activePlayerIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={nextPlayer}
                  disabled={activePlayerIndex >= roster.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Attempts</CardTitle>
                <CardDescription>Results for {player.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attemptsToShow.map((attemptNum) => {
                    const attempt = previousAttempts.find(a => a.round === attemptNum)
                    const isCurrentRound = attemptNum === currentRound
                    const attemptValue = attempt?.value || (isCurrentRound && currentValue) || "—"
                    
                    return (
                      <div 
                        key={attemptNum}
                        className={`flex justify-between items-center py-3 px-4 rounded-lg border ${
                          isCurrentRound 
                            ? 'bg-blue-50 border-blue-300' 
                            : attempt 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-gray-50 border-gray-200 opacity-50'
                        }`}
                      >
                        <span className="font-medium">
                          {event.type === "Race" ? "Time" : `Attempt ${attemptNum}`}
                          {isCurrentRound && <span className="ml-2 text-xs text-blue-600">(Current)</span>}
                        </span>
                        <span className={`text-lg font-semibold ${
                          attemptValue === "—" ? 'text-gray-400' : 'text-blue-600'
                        }`}>
                          {attemptValue}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {allDone && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">Event Complete</CardTitle>
                  <CardDescription className="text-green-700">
                    All athletes have completed their attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={onSubmitAll}
                    disabled={submitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit Event Results"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No athletes added yet.</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/dashboard/referee/events/scan")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Add Athletes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
