import { useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE_MB = 10

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function FileUpload({ onFileSelect, disabled }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  function validate(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a JPG, PNG, or PDF.'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB} MB.`
    }
    return ''
  }

  function handleFile(file) {
    const error = validate(file)
    setValidationError(error)
    if (!error) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  function handleChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload prescription file"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">{dragOver ? '📂' : '📋'}</span>
          <div>
            <p className="text-gray-700 font-medium">
              Drag &amp; drop your prescription here
            </p>
            <p className="text-gray-500 text-sm mt-1">
              or <span className="text-blue-600 underline underline-offset-2">click to browse</span>
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Supports JPG, PNG, PDF &mdash; max {MAX_SIZE_MB} MB
          </p>
        </div>
      </div>

      {validationError && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <span>⚠️</span> {validationError}
        </p>
      )}

      {selectedFile && !validationError && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-xl px-4 py-2">
          <span>📄</span>
          <span className="truncate font-medium">{selectedFile.name}</span>
          <span className="text-gray-400 shrink-0">({formatBytes(selectedFile.size)})</span>
        </div>
      )}
    </div>
  )
}
