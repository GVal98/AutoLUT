import type { LutPreset } from '@/lib/lut/types'
import { LutPreviewCard } from './lut-preview-card'

interface EliminationGridProps {
  presets: LutPreset[]
  previews: Map<string, string>
  loading: boolean
  eliminatedIds: Set<string>
  onToggleEliminate: (id: string) => void
}

export function EliminationGrid({
  presets,
  previews,
  loading,
  eliminatedIds,
  onToggleEliminate,
}: EliminationGridProps) {
  return (
    <div className="pb-20">
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
