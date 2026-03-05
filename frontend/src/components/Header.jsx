export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 no-print">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💊</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Prescription Analyzer
            </h1>
            <p className="text-sm text-gray-500">AI-powered medicine alternatives</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 max-w-lg">
          <p className="text-xs text-amber-800 leading-snug">
            <span className="font-semibold">⚠️ Disclaimer:</span>{' '}
            This tool provides informational alternatives only and is not a substitute for
            professional medical advice. Always consult a qualified healthcare professional
            before making changes to your medication.
          </p>
        </div>
      </div>
    </header>
  )
}
