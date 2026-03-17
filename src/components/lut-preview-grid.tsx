import type { LutPreset } from '@/lib/lut/types'
import { LutPreviewCard } from './lut-preview-card'
import { SelectionToolbar } from './selection-toolbar'

interface LutPreviewGridProps {
  presets: LutPreset[]
  previews: Map<string, string>
  loading: boolean
  selectedIds: Set<string>
  round: number
  canGoBack: boolean
  onToggleSelect: (id: string) => void
  onViewFullsize: (id: string | null) => void
  onRefine: () => void
  onGoBack: () => void
}

export function LutPreviewGrid({
  presets,
  previews,
  loading,
  selectedIds,
  round,
  canGoBack,
  onToggleSelect,
  onViewFullsize,
  onRefine,
  onGoBack,
}: LutPreviewGridProps) {
  const selectionOrder = [...selectedIds]

  return (
    <div>
      <SelectionToolbar
        round={round}
        selectedCount={selectedIds.size}
        maxSelections={5}
        canGoBack={canGoBack}
        canRefine={selectedIds.size > 0}
        loading={loading}
        onGoBack={onGoBack}
        onRefine={onRefine}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {round === 1 && (
          <LutPreviewCard
            name="Original"
            previewUrl={previews.get('original')}
            loading={loading}
            selected={false}
            selectable={false}
            onClick={() => onViewFullsize(null)}
          />
        )}
        {presets.map((preset) => (
          <LutPreviewCard
            key={preset.id}
            name={preset.name}
            previewUrl={previews.get(preset.id)}
            loading={loading}
            selected={selectedIds.has(preset.id)}
            selectionIndex={
              selectedIds.has(preset.id)
                ? selectionOrder.indexOf(preset.id) + 1
                : undefined
            }
            selectable
            onClick={() => onToggleSelect(preset.id)}
            onViewFullsize={() => onViewFullsize(preset.id)}
          />
        ))}
      </div>
    </div>
  )
}
