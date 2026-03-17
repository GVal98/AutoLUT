import { Sparkles, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectionFooterProps {
  selectedCount: number
  canRefine: boolean
  hasRefined: boolean
  loading: boolean
  presetsCount: number
  onRefine: () => void
  onStartElimination: () => void
}

export function SelectionFooter({
  selectedCount,
  canRefine,
  hasRefined,
  loading,
  presetsCount,
  onRefine,
  onStartElimination,
}: SelectionFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-green-500">
            Pick Favorites
          </span>
          <span className="text-sm text-muted-foreground">
            Choose presets you like &middot; {selectedCount} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hasRefined && (
            <Button
              size="sm"
              disabled={!canRefine || selectedCount === 0 || loading}
              onClick={onRefine}
            >
              <Sparkles className="size-3.5" data-icon="inline-start" />
              Refine
            </Button>
          )}
          {hasRefined && (
            <Button
              variant="outline"
              size="sm"
              disabled={presetsCount < 2 || loading}
              onClick={onStartElimination}
            >
              <Swords className="size-3.5" data-icon="inline-start" />
              Eliminate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
