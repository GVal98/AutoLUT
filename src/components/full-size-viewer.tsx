import { useRef } from 'react'
import { ArrowLeft, Download, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLutEngine } from '@/hooks/use-lut-engine'
import type { LutPreset } from '@/lib/lut/types'

interface FullSizeViewerProps {
  image: HTMLImageElement
  preset: LutPreset | null
  selected: boolean
  onToggleSelect: () => void
  onBack: () => void
}

export function FullSizeViewer({
  image,
  preset,
  selected,
  onToggleSelect,
  onBack,
}: FullSizeViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { downloadImage } = useLutEngine(canvasRef, image, preset)

  const lutName = preset?.name ?? 'Original'
  const filename = `autolut-${(preset?.id ?? 'original')}.png`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-lg font-medium">{lutName}</h2>
        </div>
        <div className="flex gap-2">
          {preset && (
            <Button
              variant={selected ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleSelect}
            >
              {selected ? (
                <Check className="size-3.5" data-icon="inline-start" />
              ) : (
                <Plus className="size-3.5" data-icon="inline-start" />
              )}
              {selected ? 'Selected' : 'Select'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadImage(filename.replace('.png', '.jpg'), 'image/jpeg')}
          >
            <Download className="size-3.5" data-icon="inline-start" />
            JPEG
          </Button>
          <Button size="sm" onClick={() => downloadImage(filename)}>
            <Download className="size-3.5" data-icon="inline-start" />
            PNG
          </Button>
        </div>
      </div>
      <div className="overflow-auto rounded-lg border bg-muted/30">
        <canvas
          ref={canvasRef}
          className="mx-auto block max-h-[80vh] max-w-full object-contain"
        />
      </div>
    </div>
  )
}
