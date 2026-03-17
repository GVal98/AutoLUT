import { useState, useCallback, useMemo } from 'react'
import { useImageUpload } from '@/hooks/use-image-upload'
import { usePreviewRenderer } from '@/hooks/use-preview-renderer'
import { useRefinement } from '@/hooks/use-refinement'
import { PRESET_LUTS } from '@/lib/lut/presets'
import { PhotoUpload } from '@/components/photo-upload'
import { LutPreviewGrid } from '@/components/lut-preview-grid'
import { FullSizeViewer } from '@/components/full-size-viewer'
import { SelectionFooter } from '@/components/selection-footer'

type ViewMode = 'upload' | 'selection' | 'fullsize'

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
  } = useRefinement(PRESET_LUTS)

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
      {viewMode === 'selection' && (
        <SelectionFooter
          round={round}
          selectedCount={selectedIds.size}
          maxSelections={5}
          canGoBack={canGoBack}
          canRefine={selectedIds.size > 0}
          loading={loading}
          onGoBack={goBack}
          onRefine={refine}
          onNewPhoto={handleNewPhoto}
        />
      )}
    </div>
  )
}

export default App
