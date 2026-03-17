import { useRef } from 'react'
import { Download, ArrowLeft, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLutEngine } from '@/hooks/use-lut-engine'
import type { LutPreset } from '@/lib/lut/types'

interface TournamentWinnerProps {
  image: HTMLImageElement
  winner: LutPreset
  onBack: () => void
}

export function TournamentWinner({
  image,
  winner,
  onBack,
}: TournamentWinnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { downloadImage, showOriginal } = useLutEngine(canvasRef, image, winner)

  const filename = `autolut-${winner.id}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="size-5 text-yellow-500" />
          <h2 className="text-lg font-medium">{winner.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadImage(`${filename}.jpg`, 'image/jpeg')}
          >
            <Download className="size-3.5" data-icon="inline-start" />
            JPEG
          </Button>
          <Button
            size="sm"
            onClick={() => downloadImage(`${filename}.png`)}
          >
            <Download className="size-3.5" data-icon="inline-start" />
            PNG
          </Button>
        </div>
      </div>
      <div className="relative overflow-auto rounded-lg border bg-muted/30">
        <canvas
          ref={canvasRef}
          className="mx-auto block max-h-[80vh] max-w-full object-contain"
          onPointerDown={() => showOriginal(true)}
          onPointerUp={() => showOriginal(false)}
          onPointerLeave={() => showOriginal(false)}
        />
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 select-none">
          Hold to compare
        </span>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-3.5" data-icon="inline-start" />
          Back to selection
        </Button>
      </div>
    </div>
  )
}
