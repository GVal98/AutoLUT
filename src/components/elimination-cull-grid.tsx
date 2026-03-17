import type { LutPreset } from '@/lib/lut/types'
import { LutPreviewCard } from './lut-preview-card'

interface EliminationCullGridProps {
  presets: LutPreset[]
  previews: Map<string, string>
  loading: boolean
  eliminatedIds: Set<string>
  onToggleEliminate: (id: string) => void
}

export function EliminationCullGrid({
  presets,
  previews,
  loading,
  eliminatedIds,
  onToggleEliminate,
}: EliminationCullGridProps) {
  return (
    <div className="pb-20">
      <p className="mb-4 text-sm text-muted-foreground">
        Tap LUTs to eliminate them. At least 2 must remain.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {presets.map((preset) => (
          <LutPreviewCard
            key={preset.id}
            name={preset.name}
            previewUrl={previews.get(preset.id)}
            loading={loading}
            selected={false}
            selectable={false}
            eliminated={eliminatedIds.has(preset.id)}
            onClick={() => onToggleEliminate(preset.id)}
          />
        ))}
      </div>
    </div>
  )
}
