import { Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LutPreviewCardProps {
  name: string
  previewUrl: string | undefined
  loading: boolean
  selected: boolean
  selectionIndex?: number
  selectable: boolean
  onClick: () => void
  onViewFullsize?: () => void
}

export function LutPreviewCard({
  name,
  previewUrl,
  loading,
  selected,
  selectionIndex,
  selectable,
  onClick,
  onViewFullsize,
}: LutPreviewCardProps) {
  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden p-0 transition-all hover:ring-2 hover:ring-primary/50',
        selected && 'ring-2 ring-primary',
      )}
      onClick={onClick}
    >
      <div className="overflow-hidden bg-muted">
        {loading || !previewUrl ? (
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
        ) : (
          <img
            src={previewUrl}
            alt={name}
            className="w-full"
          />
        )}
      </div>

      {/* Selection indicator */}
      {selectable && (
        <div className="absolute left-2 top-2">
          {selected ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow">
              {selectionIndex ?? ''}
            </span>
          ) : (
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-white/70 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      )}

      {/* Fullsize view button */}
      {onViewFullsize && (
        <button
          className="absolute right-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onViewFullsize()
          }}
        >
          <Eye className="size-3.5" />
        </button>
      )}

      <div className="px-3 py-2">
        <p className="text-xs font-medium truncate">{name}</p>
      </div>
    </Card>
  )
}
