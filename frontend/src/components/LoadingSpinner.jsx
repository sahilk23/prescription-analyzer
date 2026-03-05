export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-700 font-medium">Analyzing prescription…</p>
        <p className="text-gray-500 text-sm mt-1">
          Extracting medicines and finding alternatives
        </p>
      </div>
    </div>
  )
}
