import { useState, useCallback } from 'react'
import type { LutPreset } from '@/lib/lut/types'
import { mutateLut } from '@/lib/lut/mutate'

interface RefinementRound {
  round: number
  presets: LutPreset[]
  selectedIds: Set<string>
}

export function useRefinement(initialPresets: LutPreset[]) {
  const [round, setRound] = useState(1)
  const [presets, setPresets] = useState<LutPreset[]>(initialPresets)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<RefinementRound[]>([])

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else if (next.size < 5) {
          next.add(id)
        }
        return next
      })
    },
    [],
  )

  const refine = useCallback(() => {
    if (selectedIds.size === 0) return

    const nextRound = round + 1
    // Save current state to history
    setHistory((prev) => [...prev, { round, presets, selectedIds }])

    // Generate variations for each selected preset
    const selectedPresets = presets.filter((p) => selectedIds.has(p.id))
    const variations: LutPreset[] = []
    for (const parent of selectedPresets) {
      for (let i = 0; i < 5; i++) {
        variations.push(mutateLut(parent, i, nextRound))
      }
    }

    setPresets(variations)
    setSelectedIds(new Set())
    setRound(nextRound)
  }, [round, presets, selectedIds])

  const goBack = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setRound(prev.round)
    setPresets(prev.presets)
    setSelectedIds(prev.selectedIds)
  }, [history])

  const resetToRound1 = useCallback(() => {
    setRound(1)
    setPresets(initialPresets)
    setSelectedIds(new Set())
    setHistory([])
  }, [initialPresets])

  return {
    round,
    presets,
    selectedIds,
    canGoBack: history.length > 0,
    toggleSelection,
    refine,
    goBack,
    resetToRound1,
  }
}
