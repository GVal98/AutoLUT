import { useState, useCallback } from 'react'
import type { LutPreset } from '@/lib/lut/types'

type Phase = 'idle' | 'cull' | 'tournament' | 'winner'

interface CullState {
  candidates: LutPreset[]
  eliminatedIds: Set<string>
}

interface TournamentState {
  matchup: [LutPreset, LutPreset]
  currentRound: number
  matchIndex: number
  totalMatchups: number
  roundContestants: LutPreset[]
  winners: LutPreset[]
  bye: LutPreset | null
}

interface EliminationState {
  phase: Phase
  cull: CullState | null
  tournament: TournamentState | null
  winner: LutPreset | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildTournamentState(contestants: LutPreset[], round: number): TournamentState {
  const shuffled = shuffle(contestants)
  let bye: LutPreset | null = null
  let roundContestants = shuffled

  if (shuffled.length % 2 !== 0) {
    bye = shuffled[shuffled.length - 1]
    roundContestants = shuffled.slice(0, -1)
  }

  const totalMatchups = Math.floor(roundContestants.length / 2)

  return {
    matchup: [roundContestants[0], roundContestants[1]],
    currentRound: round,
    matchIndex: 0,
    totalMatchups,
    roundContestants,
    winners: [],
    bye,
  }
}

export function useElimination() {
  const [state, setState] = useState<EliminationState>({
    phase: 'idle',
    cull: null,
    tournament: null,
    winner: null,
  })

  const startElimination = useCallback((presets: LutPreset[]) => {
    setState({
      phase: 'cull',
      cull: {
        candidates: presets,
        eliminatedIds: new Set(),
      },
      tournament: null,
      winner: null,
    })
  }, [])

  const toggleEliminate = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.cull) return prev
      const next = new Set(prev.cull.eliminatedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        // Don't allow eliminating if it would leave fewer than 2
        const remaining = prev.cull.candidates.length - next.size - 1
        if (remaining < 2) return prev
        next.add(id)
      }
      return {
        ...prev,
        cull: { ...prev.cull, eliminatedIds: next },
      }
    })
  }, [])

  const confirmCull = useCallback(() => {
    setState((prev) => {
      if (!prev.cull) return prev
      const survivors = prev.cull.candidates.filter(
        (p) => !prev.cull!.eliminatedIds.has(p.id),
      )
      if (survivors.length < 2) return prev

      if (survivors.length === 1) {
        return { phase: 'winner', cull: null, tournament: null, winner: survivors[0] }
      }

      return {
        phase: 'tournament',
        cull: null,
        tournament: buildTournamentState(survivors, 1),
        winner: null,
      }
    })
  }, [])

  const pickWinner = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.tournament) return prev
      const t = prev.tournament
      const winner = t.matchup.find((p) => p.id === id)
      if (!winner) return prev

      const newWinners = [...t.winners, winner]
      const nextMatchIndex = t.matchIndex + 1

      if (nextMatchIndex < t.totalMatchups) {
        // More matches in this round
        const i = nextMatchIndex * 2
        return {
          ...prev,
          tournament: {
            ...t,
            matchup: [t.roundContestants[i], t.roundContestants[i + 1]],
            matchIndex: nextMatchIndex,
            winners: newWinners,
          },
        }
      }

      // Round complete — add bye winner if any
      const roundWinners = t.bye ? [...newWinners, t.bye] : newWinners

      if (roundWinners.length === 1) {
        return {
          phase: 'winner',
          cull: null,
          tournament: null,
          winner: roundWinners[0],
        }
      }

      // Next round
      return {
        ...prev,
        tournament: buildTournamentState(roundWinners, t.currentRound + 1),
      }
    })
  }, [])

  const cancel = useCallback(() => {
    setState({ phase: 'idle', cull: null, tournament: null, winner: null })
  }, [])

  return {
    phase: state.phase,
    cull: state.cull,
    tournament: state.tournament,
    winner: state.winner,
    startElimination,
    toggleEliminate,
    confirmCull,
    pickWinner,
    cancel,
  }
}
