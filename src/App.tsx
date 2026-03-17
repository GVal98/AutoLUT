import { useState, useCallback, useMemo } from 'react'
import { useImageUpload } from '@/hooks/use-image-upload'
import { usePreviewRenderer } from '@/hooks/use-preview-renderer'
import { useRefinement } from '@/hooks/use-refinement'
import { useElimination } from '@/hooks/use-elimination'
import { PRESET_LUTS } from '@/lib/lut/presets'
import { PhotoUpload } from '@/components/photo-upload'
import { LutPreviewGrid } from '@/components/lut-preview-grid'
import { FullSizeViewer } from '@/components/full-size-viewer'
import { SelectionFooter } from '@/components/selection-footer'
import { EliminationCullGrid } from '@/components/elimination-cull-grid'
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
    canGoBack,
    toggleSelection,
    refine,
    goBack,
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

  const handleEliminationCancel = useCallback(() => {
    elimination.cancel()
    setViewMode('selection')
  }, [elimination])

  const handleEliminationWinnerBack = useCallback(() => {
    if (elimination.winner) {
      setSelection(new Set([elimination.winner.id]))
    }
    elimination.cancel()
    setViewMode('selection')
  }, [elimination, setSelection])

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
      <header className="mb-8">
        <h1
          className="cursor-pointer text-2xl font-bold tracking-tight"
          onClick={handleNewPhoto}
        >
          AutoLUT
        </h1>
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

      {viewMode === 'elimination' && image && elimination.phase === 'cull' && elimination.cull && (
        <EliminationCullGrid
          presets={elimination.cull.candidates}
          previews={previews}
          loading={loading}
          eliminatedIds={elimination.cull.eliminatedIds}
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
          totalMatchups={elimination.tournament.totalMatchups}
          onPick={elimination.pickWinner}
        />
      )}

      {viewMode === 'elimination' && image && elimination.phase === 'winner' && elimination.winner && (
        <TournamentWinner
          image={image}
          winner={elimination.winner}
          onBack={handleEliminationWinnerBack}
        />
      )}

      {viewMode === 'selection' && (
        <SelectionFooter
          round={round}
          selectedCount={selectedIds.size}
          canGoBack={canGoBack}
          canRefine={selectedIds.size > 0}
          loading={loading}
          presetsCount={presets.length}
          onGoBack={goBack}
          onRefine={refine}
          onNewPhoto={handleNewPhoto}
          onStartElimination={handleStartElimination}
        />
      )}

      {viewMode === 'elimination' && elimination.phase === 'cull' && elimination.cull && (
        <EliminationFooter
          phase="cull"
          remainingCount={elimination.cull.candidates.length - elimination.cull.eliminatedIds.size}
          totalCount={elimination.cull.candidates.length}
          canStartTournament={
            elimination.cull.candidates.length - elimination.cull.eliminatedIds.size >= 2
          }
          onConfirmCull={elimination.confirmCull}
          onCancel={handleEliminationCancel}
        />
      )}

      {viewMode === 'elimination' && elimination.phase === 'tournament' && elimination.tournament && (
        <EliminationFooter
          phase="tournament"
          currentRound={elimination.tournament.currentRound}
          matchIndex={elimination.tournament.matchIndex}
          totalMatchups={elimination.tournament.totalMatchups}
          onCancel={handleEliminationCancel}
        />
      )}
    </div>
  )
}

export default App
