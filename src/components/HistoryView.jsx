const PERSON_COLORS = {
  Kevin:  'bg-bnp-mid/30 text-bnp-light border border-bnp-mid/50',
  Emeric: 'bg-bnp-teal/30 text-green-300 border border-bnp-teal/50'
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function HistoryView({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 gap-3 pb-20">
        <span className="text-5xl">📭</span>
        <p className="text-white/50 text-lg font-semibold">Aucun historique</p>
        <p className="text-sm">Appuyez sur "Payé" pour commencer</p>
      </div>
    )
  }

  const groups = {}
  history.forEach(entry => {
    const date = formatDate(entry.date)
    if (!groups[date]) groups[date] = []
    groups[date].push(entry)
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-white font-bold text-base">Historique des paiements</h2>
        <button
          onClick={onClear}
          className="text-red-400 text-xs hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
        >
          Effacer
        </button>
      </div>

      <div className="overflow-y-auto flex-1 -mr-2 pr-2">
        {Object.entries(groups).map(([date, entries]) => (
          <div key={date} className="mb-5 slide-up">
            <p className="text-bnp-green text-xs font-semibold uppercase tracking-wider mb-2">{date}</p>
            <div className="space-y-2">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between bg-bnp-dark rounded-xl px-4 py-3 border border-bnp-deep"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.restaurantEmoji}</span>
                    <p className="text-white font-medium text-sm">{entry.restaurantName}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PERSON_COLORS[entry.paidBy] || ''}`}>
                    {entry.paidBy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
