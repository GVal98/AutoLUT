import { useRef, useEffect } from 'react'
import { useLutEngine } from '@/hooks/use-lut-engine'
import type { LutPreset } from '@/lib/lut/types'

interface TournamentMatchupProps {
  image: HTMLImageElement
  left: LutPreset
  right: LutPreset
  currentRound: number
  matchIndex: number
  onPick: (id: string) => void
}

function MatchupCanvas({
  image,
  preset,
  onPick,
}: {
  image: HTMLImageElement
  preset: LutPreset
  onPick: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLutEngine(canvasRef, image, preset)

  return (
    <button
      className="group relative flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border bg-muted/30 p-2 transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onPick}
    >
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded">
        <canvas
          ref={canvasRef}
          className="block max-h-[38vh] max-w-full md:max-h-none md:w-full"
        />
      </div>
      <span className="text-sm font-medium">{preset.name}</span>
    </button>
  )
}

export function TournamentMatchup({
  image,
  left,
  right,
  currentRound,
  matchIndex,
  onPick,
}: TournamentMatchupProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll matchup into view when the match changes (prevents jump-to-top on mobile)
  useEffect(() => {
    containerRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' })
  }, [matchIndex, currentRound])

  return (
    <div ref={containerRef} className="flex flex-col gap-4 pb-20">
      <div className="flex flex-col gap-4 md:flex-row">
        <MatchupCanvas
          key={left.id}
          image={image}
          preset={left}
          onPick={() => onPick(left.id)}
        />
        <MatchupCanvas
          key={right.id}
          image={image}
          preset={right}
          onPick={() => onPick(right.id)}
        />
      </div>
    </div>
  )
}
