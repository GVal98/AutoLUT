import type { LutPreset } from '@/lib/lut/types'
import { LutPreviewCard } from './lut-preview-card'

interface LutPreviewGridProps {
  presets: LutPreset[]
  previews: Map<string, string>
  loading: boolean
  selectedIds: Set<string>
  round: number
  onToggleSelect: (id: string) => void
  onViewFullsize: (id: string | null) => void
}

export function LutPreviewGrid({
  presets,
  previews,
  loading,
  selectedIds,
  round,
  onToggleSelect,
  onViewFullsize,
}: LutPreviewGridProps) {
  const selectionOrder = [...selectedIds]

  return (
    <div>
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
            isParent={preset.isParent}
            onClick={() => onToggleSelect(preset.id)}
            onViewFullsize={() => onViewFullsize(preset.id)}
          />
        ))}
      </div>
    </div>
  )
}
