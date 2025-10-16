"use client"

import type { Player } from "./store/use-event-store"

export function RosterList({
  players,
  onRemove,
}: {
  players: Player[]
  onRemove?: (id: string) => void
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Roster</h3>
        <span className="text-xs text-muted-foreground">{players.length} added</span>
      </div>
      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground">No players yet. Scan a QR to add.</p>
      ) : (
        <ul className="grid gap-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.id}</div>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
