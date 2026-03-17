import { Swords, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EliminationFooterProps {
  phase: 'cull' | 'tournament'
  // Cull phase
  remainingCount?: number
  totalCount?: number
  canStartTournament?: boolean
  onConfirmCull?: () => void
  // Tournament phase
  currentRound?: number
  matchIndex?: number
  totalMatchups?: number
  // Shared
  onCancel: () => void
}

export function EliminationFooter({
  phase,
  remainingCount,
  totalCount,
  canStartTournament,
  onConfirmCull,
  currentRound,
  matchIndex,
  totalMatchups,
  onCancel,
}: EliminationFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {phase === 'cull' ? (
          <>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                Cull
              </span>
              <span className="text-sm text-muted-foreground">
                {remainingCount}/{totalCount} remaining
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!canStartTournament}
                onClick={onConfirmCull}
              >
                <Swords className="size-3.5" data-icon="inline-start" />
                Start Tournament
              </Button>
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="size-3.5" data-icon="inline-start" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                Tournament
              </span>
              <span className="text-sm text-muted-foreground">
                Match {(matchIndex ?? 0) + 1}/{totalMatchups} &middot; Round{' '}
                {currentRound}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="size-3.5" data-icon="inline-start" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
