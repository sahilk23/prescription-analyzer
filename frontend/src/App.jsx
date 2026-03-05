import { useState } from 'react'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import MedicineList from './components/MedicineList'
import AlternativePanel from './components/AlternativePanel'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import Disclaimer from './components/Disclaimer'
import { analyzePrescription } from './services/api'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  async function handleFileSelect(file) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzePrescription(file)
      setResult(data)
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'An unexpected error occurred. Please try again.'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = result.medicines
      .map((med) => {
        const allopathy = med.alternatives?.allopathy?.map((a) => a.name).join(', ') || 'None'
        const ayurveda = med.alternatives?.ayurveda?.map((a) => a.name).join(', ') || 'None'
        const homeopathy = med.alternatives?.homeopathy?.map((a) => a.name).join(', ') || 'None'
        return [
          `Medicine: ${med.generic_name}${med.brand_name !== med.generic_name ? ` (${med.brand_name})` : ''}`,
          `  Allopathy: ${allopathy}`,
          `  Ayurveda: ${ayurveda}`,
          `  Homeopathy: ${homeopathy}`,
        ].join('\n')
      })
      .join('\n\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handlePrint() {
    window.print()
  }

  function handleReset() {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Upload section */}
        <section className="card no-print">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📤</span> Upload Prescription
          </h2>
          <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
        </section>

        {/* Loading */}
        {loading && (
          <div className="card">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Results */}
        {result && (
          <>
            {/* Action bar */}
            <div className="flex flex-wrap gap-3 no-print">
              <button onClick={handleCopy} className="btn-primary">
                {copied ? '✅ Copied!' : '📋 Copy Results'}
              </button>
              <button
                onClick={handlePrint}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200"
              >
                🖨️ Print
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200 ml-auto"
              >
                🔄 Analyze Another
              </button>
            </div>

            <MedicineList medicines={result.medicines} />
            <AlternativePanel medicines={result.medicines} />
            <Disclaimer />
          </>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 no-print">
        Prescription Analyzer &mdash; For informational purposes only
      </footer>
    </div>
  )
}
