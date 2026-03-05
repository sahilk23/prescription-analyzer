export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
      <span className="text-red-500 text-xl shrink-0">⚠️</span>
      <div>
        <p className="font-semibold text-red-700">Something went wrong</p>
        <p className="text-red-600 text-sm mt-1">{message}</p>
      </div>
    </div>
  )
}
