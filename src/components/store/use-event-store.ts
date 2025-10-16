"use client"

import { create } from "zustand"
import type { CreatedEvent } from "../../lib/api"

export type Player = { id: string; name: string }
type TrialEntry = { value: string; locked: boolean }
type TrialsByRound = Record<number, Record<string, TrialEntry>>

type State = {
  event?: CreatedEvent
  roster: Player[]
  trials: TrialsByRound
  currentRound: number // 1-based
  activePlayerIndex: number
}

type Actions = {
  setEvent: (evt: CreatedEvent) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  setActivePlayerIndex: (idx: number) => void
  setTrialValue: (value: string) => void
  saveCurrentAttempt: () => void
  nextPlayer: () => void
  prevPlayer: () => void
  advanceRound: () => void
  isRoundComplete: (round: number) => boolean
  isEventComplete: () => boolean
  reset: () => void
  clearStore: () => void
}

const initialState: State = {
  event: undefined,
  roster: [],
  trials: {},
  currentRound: 1,
  activePlayerIndex: 0,
}

function ensureEntry(trials: TrialsByRound, round: number, playerId: string): TrialsByRound {
  const roundMap = trials[round] ?? {}
  if (!roundMap[playerId]) {
    roundMap[playerId] = { value: "", locked: false }
  }
  return { ...trials, [round]: roundMap }
}

export const useEventStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setEvent: (evt) => set({ event: evt, currentRound: 1, activePlayerIndex: 0, trials: {}, roster: [] }),

  addPlayer: (player) =>
    set((s) => {
      if (s.roster.some((p) => p.id === player.id)) return s
      // Initialize entry for current round for convenience
      const round = s.currentRound
      const nextTrials = ensureEntry({ ...s.trials }, round, player.id)
      return { ...s, roster: [...s.roster, player], trials: nextTrials }
    }),

  removePlayer: (playerId) =>
    set((s) => {
      const idx = s.roster.findIndex((p) => p.id === playerId)
      const roster = s.roster.filter((p) => p.id !== playerId)
      // Clean trials for that player across rounds
      const trials: TrialsByRound = Object.fromEntries(
        Object.entries(s.trials).map(([round, byPlayer]) => {
          const copy = { ...byPlayer }
          delete copy[playerId]
          return [Number(round), copy]
        }),
      )
      let activePlayerIndex = s.activePlayerIndex
      if (idx !== -1 && activePlayerIndex >= roster.length) {
        activePlayerIndex = Math.max(0, roster.length - 1)
      }
      return { ...s, roster, trials, activePlayerIndex }
    }),

  setActivePlayerIndex: (idx) =>
    set((s) => {
      const clamped = Math.min(Math.max(idx, 0), Math.max(0, s.roster.length - 1))
      return { ...s, activePlayerIndex: clamped }
    }),

  setTrialValue: (value) =>
    set((s) => {
      if (!s.event || s.roster.length === 0) return s
      const round = s.currentRound
      const player = s.roster[s.activePlayerIndex]
      if (!player) return s
      const trials = ensureEntry({ ...s.trials }, round, player.id)
      trials[round][player.id] = { ...trials[round][player.id], value }
      return { ...s, trials }
    }),

  saveCurrentAttempt: () =>
    set((s) => {
      const { event } = s
      if (!event || s.roster.length === 0) return s
      const round = s.currentRound
      const player = s.roster[s.activePlayerIndex]
      if (!player) return s
      const trials = ensureEntry({ ...s.trials }, round, player.id)
      const entry = trials[round][player.id]
      // Lock only if a value exists
      if (!entry.value || entry.value.trim() === "") return s
      trials[round][player.id] = { ...entry, locked: true }

      // Determine navigation
      const lastPlayerIndex = s.roster.length - 1
      const isLastPlayer = s.activePlayerIndex >= lastPlayerIndex

      // For Race: single round only
      if (event.type === "Race") {
        const nextIndex = isLastPlayer ? lastPlayerIndex : s.activePlayerIndex + 1
        return { ...s, trials, activePlayerIndex: nextIndex }
      }

      // Field: 3 rounds; move through players, then next round
      if (!isLastPlayer) {
        return { ...s, trials, activePlayerIndex: s.activePlayerIndex + 1 }
      } else {
        // end of roster for this round
        if (s.currentRound < 3) {
          return { ...s, trials, currentRound: s.currentRound + 1, activePlayerIndex: 0 }
        }
        return { ...s, trials }
      }
    }),

  nextPlayer: () =>
    set((s) => ({ ...s, activePlayerIndex: Math.min(s.activePlayerIndex + 1, Math.max(0, s.roster.length - 1)) })),

  prevPlayer: () => set((s) => ({ ...s, activePlayerIndex: Math.max(s.activePlayerIndex - 1, 0) })),

  advanceRound: () => set((s) => ({ ...s, currentRound: s.currentRound + 1, activePlayerIndex: 0 })),

  isRoundComplete: (round) => {
    const s = get()
    if (s.roster.length === 0) return false
    const map = s.trials[round] || {}
    return s.roster.every((p) => map[p.id]?.locked)
  },

  isEventComplete: () => {
    const s = get()
    if (!s.event) return false
    if (s.roster.length === 0) return false
    if (s.event.type === "Race") {
      return get().isRoundComplete(1)
    }
    // For Field events: all 3 rounds must be complete
    return get().isRoundComplete(1) && get().isRoundComplete(2) && get().isRoundComplete(3)
  },

  reset: () => set(initialState),

  clearStore: () => set(initialState),
}))
