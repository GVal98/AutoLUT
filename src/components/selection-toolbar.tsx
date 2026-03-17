import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectionToolbarProps {
  round: number
  selectedCount: number
  maxSelections: number
  canGoBack: boolean
  canRefine: boolean
  loading: boolean
  onGoBack: () => void
  onRefine: () => void
}

export function SelectionToolbar({
  round,
  selectedCount,
  maxSelections,
  canGoBack,
  canRefine,
  loading,
  onGoBack,
  onRefine,
}: SelectionToolbarProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
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
      <Button
        size="sm"
        disabled={!canRefine || selectedCount === 0 || loading}
        onClick={onRefine}
      >
        <Sparkles className="size-3.5" data-icon="inline-start" />
        Refine
      </Button>
    </div>
  )
}
