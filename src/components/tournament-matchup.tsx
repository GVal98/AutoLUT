import { useRef } from 'react'
import { useLutEngine } from '@/hooks/use-lut-engine'
import type { LutPreset } from '@/lib/lut/types'

interface TournamentMatchupProps {
  image: HTMLImageElement
  left: LutPreset
  right: LutPreset
  currentRound: number
  matchIndex: number
  totalMatchups: number
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
  const { showOriginal } = useLutEngine(canvasRef, image, preset)

  return (
    <button
      className="group relative flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border bg-muted/30 p-2 transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onPick}
    >
      <div className="relative w-full overflow-hidden rounded">
        <canvas
          ref={canvasRef}
          className="block w-full"
          onPointerDown={() => showOriginal(true)}
          onPointerUp={() => showOriginal(false)}
          onPointerLeave={() => showOriginal(false)}
        />
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 opacity-0 transition-opacity select-none group-hover:opacity-100">
          Hold to compare
        </span>
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
  totalMatchups,
  onPick,
}: TournamentMatchupProps) {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="text-center text-sm text-muted-foreground">
        Match {matchIndex + 1} of {totalMatchups} &middot; Round {currentRound}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Tap the one you prefer
      </p>
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
