import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  isDragging: boolean
  error: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  openPicker: () => void
}

export function PhotoUpload({
  isDragging,
  error,
  inputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  openPicker,
}: PhotoUploadProps) {
  return (
    <Card
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openPicker}
    >
      <Upload className="mb-4 size-10 text-muted-foreground" />
      <p className="text-lg font-medium">Drop your photo here</p>
      <p className="mt-1 text-sm text-muted-foreground">
        or click to browse — JPEG, PNG, WebP
      </p>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />
    </Card>
  )
}
