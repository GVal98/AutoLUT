import { ArrowLeft, ImagePlus, Sparkles, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectionFooterProps {
  round: number
  selectedCount: number
  maxSelections: number
  canGoBack: boolean
  canRefine: boolean
  loading: boolean
  presetsCount: number
  onGoBack: () => void
  onRefine: () => void
  onNewPhoto: () => void
  onStartElimination: () => void
}

export function SelectionFooter({
  round,
  selectedCount,
  maxSelections,
  canGoBack,
  canRefine,
  loading,
  presetsCount,
  onGoBack,
  onRefine,
  onNewPhoto,
  onStartElimination,
}: SelectionFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <Button variant="ghost" size="sm" onClick={onGoBack}>
              <ArrowLeft className="size-3.5" data-icon="inline-start" />
              Back
            </Button>
          )}
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Round {round}
          </span>
          <span className="text-sm text-muted-foreground">
            {selectedCount}/{maxSelections} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={!canRefine || selectedCount === 0 || loading}
            onClick={onRefine}
          >
            <Sparkles className="size-3.5" data-icon="inline-start" />
            Refine
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={presetsCount < 2 || loading}
            onClick={onStartElimination}
          >
            <Swords className="size-3.5" data-icon="inline-start" />
            Eliminate
          </Button>
          <Button variant="outline" size="sm" onClick={onNewPhoto}>
            <ImagePlus className="size-3.5" data-icon="inline-start" />
            New Photo
          </Button>
        </div>
      </div>
    </div>
  )
}
