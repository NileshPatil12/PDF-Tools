import { useCallback, useRef, useState } from 'react'
import axios from 'axios'
import GlassCard from './GlassCard'
import Button from './Button'
import ToolIcon from '../icons/ToolIcons'
import { formatSize } from '../../utils/formatSize'

const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

function createFileEntry(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    file,
    progress: 0,
    status: STATUS.IDLE,
    error: null,
  }
}

function simulateUpload(onProgress) {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4
      if (progress >= 100) {
        clearInterval(interval)
        onProgress(100)
        resolve()
      } else {
        onProgress(Math.min(Math.round(progress), 99))
      }
    }, 120)
  })
}

async function uploadWithAxios(file, uploadUrl, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  await axios.post(uploadUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total) return
      onProgress(Math.round((event.loaded * 100) / event.total))
    },
  })
}

function FileUploadItem({ entry, onRemove, disabled }) {
  const { file, progress, status, error } = entry
  const isUploading = status === STATUS.UPLOADING
  const isSuccess = status === STATUS.SUCCESS
  const isError = status === STATUS.ERROR

  return (
    <li>
      <GlassCard hover={false} className="px-4 py-3 sm:px-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11',
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-400'
                : isError
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-violet-500/20 text-violet-300',
            ].join(' ')}
          >
            {isSuccess ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-7.5" />
              </svg>
            ) : isError ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <ToolIcon name="document" className="h-5 w-5" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {formatSize(file.size)}
                  {isUploading && (
                    <span className="ml-2 text-violet-400">· {progress}%</span>
                  )}
                  {isSuccess && (
                    <span className="ml-2 text-emerald-400">· Uploaded</span>
                  )}
                  {isError && (
                    <span className="ml-2 text-rose-400">· {error ?? 'Failed'}</span>
                  )}
                </p>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  disabled={disabled}
                  className="shrink-0 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 disabled:opacity-50"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {(isUploading || isSuccess || isError) && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-300 ease-out',
                      isError
                        ? 'bg-rose-500'
                        : isSuccess
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-violet-500 to-indigo-500',
                    ].join(' ')}
                    style={{ width: `${isError ? 100 : progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </li>
  )
}

export default function FileUpload({
  accept = '.pdf,application/pdf',
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024,
  multiple = true,
  uploadUrl,
  onUpload,
  onFilesChange,
  dropzoneTitle = 'Drag & drop files here',
  dropzoneHint = 'from your device',
  helperText,
  className = '',
  validateFile,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [entries, setEntries] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const updateEntries = useCallback(
    (updater) => {
      setEntries((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        onFilesChange?.(next.map((e) => e.file))
        return next
      })
    },
    [onFilesChange],
  )

  const validate = useCallback(
    (file) => {
      if (validateFile) return validateFile(file)
      if (file.size > maxFileSize) {
        return `File exceeds ${formatSize(maxFileSize)} limit`
      }
      return null
    },
    [maxFileSize, validateFile],
  )

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList)
      if (!incoming.length) return

      const newEntries = []
      for (const file of incoming) {
        const error = validate(file)
        if (error) {
          newEntries.push({
            ...createFileEntry(file),
            status: STATUS.ERROR,
            error,
            progress: 0,
          })
          continue
        }
        newEntries.push(createFileEntry(file))
      }

      updateEntries((prev) => {
        const base = multiple ? prev : []
        const merged = [...base, ...newEntries].slice(0, maxFiles)
        return merged
      })
    },
    [maxFiles, updateEntries, validate],
  )

  const removeFile = (id) => {
    updateEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const clearAll = () => updateEntries([])

  const uploadSingle = async (entry) => {
    const setProgress = (progress) => {
      updateEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, progress, status: STATUS.UPLOADING } : e,
        ),
      )
    }

    try {
      if (onUpload) {
        await onUpload(entry.file, setProgress)
      } else if (uploadUrl) {
        await uploadWithAxios(entry.file, uploadUrl, setProgress)
      } else {
        await simulateUpload(setProgress)
      }

      updateEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, progress: 100, status: STATUS.SUCCESS }
            : e,
        ),
      )
    } catch (err) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Upload failed'
      updateEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, status: STATUS.ERROR, error: message, progress: 0 }
            : e,
        ),
      )
    }
  }

  const handleUploadAll = async () => {
    const pending = entries.filter((e) => e.status === STATUS.IDLE)
    if (!pending.length || isUploading) return

    setIsUploading(true)
    for (const entry of pending) {
      await uploadSingle(entry)
    }
    setIsUploading(false)
  }

  const idleCount = entries.filter((e) => e.status === STATUS.IDLE).length
  const hasPending = idleCount > 0

  return (
    <div className={className}>
      <GlassCard hover={false} className="overflow-hidden p-1">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            if (e.currentTarget === e.target) setIsDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={[
            'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-all duration-300 sm:min-h-[220px] sm:px-6 sm:py-12',
            isDragging
              ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
              : 'border-white/15 bg-white/[0.02] hover:border-violet-500/40 hover:bg-violet-500/5',
            isUploading ? 'pointer-events-none opacity-70' : '',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={isUploading || entries.length >= maxFiles}
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />

          <div
            className={[
              'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-600/40 transition-transform duration-300 sm:mb-5 sm:h-16 sm:w-16',
              isDragging ? 'scale-110' : '',
            ].join(' ')}
          >
            <ToolIcon
              name="upload"
              className={`h-7 w-7 text-violet-300 transition-transform duration-300 sm:h-8 sm:w-8 ${isDragging ? '-translate-y-1' : ''}`}
            />
          </div>

          <p className="text-base font-medium text-zinc-200 sm:text-lg">
            {isDragging ? 'Release to add files' : dropzoneTitle}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            or <span className="text-violet-400">browse</span> {dropzoneHint}
          </p>
          {helperText && (
            <p className="mt-3 max-w-sm text-xs text-zinc-600">{helperText}</p>
          )}
        </div>
      </GlassCard>

      {entries.length > 0 && (
        <div className="mt-5 space-y-3 sm:mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-zinc-400">
              {entries.length} file{entries.length !== 1 ? 's' : ''}
              {hasPending && !isUploading && ` · ${idleCount} ready`}
            </p>
            <button
              type="button"
              onClick={clearAll}
              disabled={isUploading}
              className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50 sm:self-auto"
            >
              Clear all
            </button>
          </div>

          <ul className="space-y-2">
            {entries.map((entry) => (
              <FileUploadItem
                key={entry.id}
                entry={entry}
                onRemove={removeFile}
                disabled={isUploading}
              />
            ))}
          </ul>

          {hasPending && (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleUploadAll}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading…' : `Upload ${idleCount} file${idleCount !== 1 ? 's' : ''}`}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={clearAll}
                disabled={isUploading}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
