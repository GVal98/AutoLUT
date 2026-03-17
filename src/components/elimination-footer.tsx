import { Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EliminationFooterProps {
  phase: 'eliminate' | 'tournament'
  // Eliminate phase
  remainingCount?: number
  totalCount?: number
  canStartTournament?: boolean
  onConfirmElimination?: () => void
  // Tournament phase
  matchIndex?: number
  totalMatchups?: number
}

export function EliminationFooter({
  phase,
  remainingCount,
  totalCount,
  canStartTournament,
  onConfirmElimination,
  matchIndex,
  totalMatchups,
}: EliminationFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {phase === 'eliminate' ? (
          <>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-red-500">
                Elimination
              </span>
              <span className="text-sm text-muted-foreground">
                Tap to eliminate &middot; {remainingCount}/{totalCount} remaining
              </span>
            </div>
            <Button
              size="sm"
              disabled={!canStartTournament}
              onClick={onConfirmElimination}
            >
              <Swords className="size-3.5" data-icon="inline-start" />
              Start Tournament
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-green-500">
              Tournament
            </span>
            <span className="text-sm text-muted-foreground">
              Tap the one you prefer &middot; Match {(matchIndex ?? 0) + 1}/{totalMatchups}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
