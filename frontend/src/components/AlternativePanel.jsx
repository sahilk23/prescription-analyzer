const CATEGORY_CONFIG = {
  allopathy: {
    label: 'Allopathy',
    icon: '💊',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    heading: 'text-blue-800',
  },
  ayurveda: {
    label: 'Ayurveda',
    icon: '🌿',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    heading: 'text-green-800',
  },
  homeopathy: {
    label: 'Homeopathy',
    icon: '🔬',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    heading: 'text-purple-800',
  },
}

function CategoryBlock({ category, alternatives }) {
  const cfg = CATEGORY_CONFIG[category]
  if (!cfg) return null

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${cfg.heading}`}>
        <span>{cfg.icon}</span> {cfg.label}
        <span className={`ml-auto badge ${cfg.badge}`}>{alternatives.length}</span>
      </h4>
      {alternatives.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No alternatives available.</p>
      ) : (
        <ul className="space-y-2">
          {alternatives.map((alt, i) => (
            <li key={i} className="bg-white rounded-lg px-3 py-2 shadow-sm">
              <p className="font-medium text-gray-800 text-sm">{alt.name}</p>
              {alt.description && (
                <p className="text-gray-500 text-xs mt-0.5">{alt.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AlternativePanel({ medicines }) {
  if (!medicines || medicines.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span>🔄</span> Alternative Medicines
      </h2>
      {medicines.map((med, idx) => (
        <div key={idx} className="card">
          <div className="mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              {med.generic_name}
              {med.brand_name && med.brand_name !== med.generic_name && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (brand: {med.brand_name})
                </span>
              )}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['allopathy', 'ayurveda', 'homeopathy'].map((cat) => (
              <CategoryBlock
                key={cat}
                category={cat}
                alternatives={med.alternatives?.[cat] || []}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
