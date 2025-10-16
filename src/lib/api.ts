export type EventType = "Field" | "Race"

export type CreatedEvent = {
  id: string
  email: string
  type: EventType
  discipline: string
}

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function createEvent(params: {
  email: string
  password: string
  type: EventType
  discipline: string
}): Promise<CreatedEvent> {
  // password is ignored; this is a dummy API
  const id = "evt_" + Math.random().toString(36).slice(2, 10)
  return delay({
    id,
    email: params.email,
    type: params.type,
    discipline: params.discipline,
  })
}

export async function fetchPlayerById(playerId: string): Promise<{ id: string; name: string }> {
  // Deterministic fake name from id tail
  const tail = playerId.slice(-4).toUpperCase()
  const name = `Player ${tail}`
  return delay({ id: playerId, name })
}

export async function submitEvent(payload: {
  event: CreatedEvent
  roster: Array<{ id: string; name: string }>
  trials: Record<number, Record<string, { value: string; locked: boolean }>>
}): Promise<{ ok: true; submittedAt: string }> {
  // Pretend to send to server
  return delay({ ok: true, submittedAt: new Date().toISOString() }, 900)
}
