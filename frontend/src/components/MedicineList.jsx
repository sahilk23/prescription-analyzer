export default function MedicineList({ medicines }) {
  if (!medicines || medicines.length === 0) return null

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>🧪</span> Detected Medicines
        <span className="ml-auto badge bg-blue-100 text-blue-700">
          {medicines.length} found
        </span>
      </h2>
      <ul className="space-y-2">
        {medicines.map((med, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
          >
            <span className="text-blue-500 font-bold text-sm w-6 text-center shrink-0">
              {idx + 1}
            </span>
            <div>
              <span className="font-medium text-gray-800">{med.generic_name}</span>
              {med.brand_name && med.brand_name !== med.generic_name && (
                <span className="ml-2 text-sm text-gray-500">
                  (brand: {med.brand_name})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
