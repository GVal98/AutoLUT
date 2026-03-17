import { useState, useCallback, useMemo, useEffect } from 'react'
import { useImageUpload } from '@/hooks/use-image-upload'
import { usePreviewRenderer } from '@/hooks/use-preview-renderer'
import { useRefinement } from '@/hooks/use-refinement'
import { useElimination } from '@/hooks/use-elimination'
import { PRESET_LUTS } from '@/lib/lut/presets'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhotoUpload } from '@/components/photo-upload'
import { LutPreviewGrid } from '@/components/lut-preview-grid'
import { FullSizeViewer } from '@/components/full-size-viewer'
import { SelectionFooter } from '@/components/selection-footer'
import { EliminationGrid } from '@/components/elimination-grid'
import { TournamentMatchup } from '@/components/tournament-matchup'
import { TournamentWinner } from '@/components/tournament-winner'
import { EliminationFooter } from '@/components/elimination-footer'

type ViewMode = 'upload' | 'selection' | 'fullsize' | 'elimination'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('upload')
  const [fullsizePresetId, setFullsizePresetId] = useState<string | null>(null)

  const {
    image,
    isDragging,
    error,
    inputRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    openPicker,
    reset,
  } = useImageUpload()

  const {
    round,
    presets,
    selectedIds,
    toggleSelection,
    refine,
    resetToRound1,
    setSelection,
  } = useRefinement(PRESET_LUTS)

  const elimination = useElimination()

  const { previews, loading } = usePreviewRenderer(image, presets)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFileChange(e)
      setViewMode('selection')
      resetToRound1()
    },
    [onFileChange, resetToRound1],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      onDrop(e)
      setViewMode('selection')
      resetToRound1()
    },
    [onDrop, resetToRound1],
  )

  const handleViewFullsize = useCallback((id: string | null) => {
    setFullsizePresetId(id)
    setViewMode('fullsize')
  }, [])

  const handleBackToSelection = useCallback(() => {
    setViewMode('selection')
  }, [])

  const handleNewPhoto = useCallback(() => {
    reset()
    setViewMode('upload')
    resetToRound1()
  }, [reset, resetToRound1])

  const handleStartElimination = useCallback(() => {
    elimination.startElimination(presets)
    setViewMode('elimination')
  }, [elimination, presets])

  // Auto-start elimination after refine (round goes from 1 to 2)
  useEffect(() => {
    if (round > 1 && viewMode === 'selection') {
      handleStartElimination()
    }
  }, [round]) // eslint-disable-line react-hooks/exhaustive-deps

  const fullsizePreset = useMemo(
    () => presets.find((p) => p.id === fullsizePresetId) ?? null,
    [fullsizePresetId, presets],
  )

  const isFullsizeSelected = fullsizePresetId
    ? selectedIds.has(fullsizePresetId)
    : false

  const handleFullsizeToggleSelect = useCallback(() => {
    if (fullsizePresetId) {
      toggleSelection(fullsizePresetId)
    }
  }, [fullsizePresetId, toggleSelection])

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1
          className="cursor-pointer text-2xl font-bold tracking-tight"
          onClick={handleNewPhoto}
        >
          AutoLUT
        </h1>
        {viewMode !== 'upload' && (
          <Button variant="outline" size="sm" onClick={handleNewPhoto}>
            <ImagePlus className="size-3.5" data-icon="inline-start" />
            New Photo
          </Button>
        )}
      </header>

      {viewMode === 'upload' && (
        <div className="mx-auto max-w-lg">
          <PhotoUpload
            isDragging={isDragging}
            error={error}
            inputRef={inputRef}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            openPicker={openPicker}
          />
        </div>
      )}

      {viewMode === 'selection' && image && (
        <div className="pb-20">
          <LutPreviewGrid
            presets={presets}
            previews={previews}
            loading={loading}
            selectedIds={selectedIds}
            round={round}
            onToggleSelect={toggleSelection}
            onViewFullsize={handleViewFullsize}
          />
        </div>
      )}

      {viewMode === 'fullsize' && image && (
        <FullSizeViewer
          image={image}
          preset={fullsizePreset}
          selected={isFullsizeSelected}
          onToggleSelect={handleFullsizeToggleSelect}
          onBack={handleBackToSelection}
        />
      )}

      {viewMode === 'elimination' && image && elimination.phase === 'eliminate' && elimination.eliminate && (
        <EliminationGrid
          presets={elimination.eliminate.candidates}
          previews={previews}
          loading={loading}
          eliminatedIds={elimination.eliminate.eliminatedIds}
          onToggleEliminate={elimination.toggleEliminate}
        />
      )}

      {viewMode === 'elimination' && image && elimination.phase === 'tournament' && elimination.tournament && (
        <TournamentMatchup
          image={image}
          left={elimination.tournament.matchup[0]}
          right={elimination.tournament.matchup[1]}
          currentRound={elimination.tournament.currentRound}
          matchIndex={elimination.tournament.matchIndex}
          onPick={elimination.pickWinner}
        />
      )}

      {viewMode === 'elimination' && image && elimination.phase === 'winner' && elimination.winner && (
        <TournamentWinner
          image={image}
          winner={elimination.winner}
        />
      )}

      {viewMode === 'selection' && (
        <SelectionFooter
          selectedCount={selectedIds.size}
          canRefine={selectedIds.size > 0}
          hasRefined={round > 1}
          loading={loading}
          presetsCount={presets.length}
          onRefine={refine}
          onStartElimination={handleStartElimination}
        />
      )}

      {viewMode === 'elimination' && elimination.phase === 'eliminate' && elimination.eliminate && (
        <EliminationFooter
          phase="eliminate"
          remainingCount={elimination.eliminate.candidates.length - elimination.eliminate.eliminatedIds.size}
          totalCount={elimination.eliminate.candidates.length}
          canStartTournament={
            elimination.eliminate.candidates.length - elimination.eliminate.eliminatedIds.size >= 2
          }
          onConfirmElimination={elimination.confirmElimination}
        />
      )}

      {viewMode === 'elimination' && elimination.phase === 'tournament' && elimination.tournament && (
        <EliminationFooter
          phase="tournament"
          matchIndex={elimination.tournament.matchIndex}
          totalMatchups={elimination.tournament.totalMatchups}
        />
      )}
    </div>
  )
}

export default App
