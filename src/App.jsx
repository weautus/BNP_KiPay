import { useState } from 'react'
import { useStorage } from './hooks/useStorage'
import RestaurantCard from './components/RestaurantCard'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'

const TABS = [
  { id: 'home', label: 'Restaurants', icon: '🍽️' },
  { id: 'history', label: 'Historique', icon: '📋' },
  { id: 'settings', label: 'Gérer', icon: '⚙️' }
]

// Count payments per person from history
function getStats(history) {
  const counts = {}
  history.forEach(h => {
    counts[h.paidBy] = (counts[h.paidBy] || 0) + 1
  })
  return counts
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [toast, setToast] = useState(null)
  const {
    restaurants, history,
    recordPayment, addRestaurant, removeRestaurant, updateRestaurant, clearHistory,
    PEOPLE
  } = useStorage()

  const handlePay = (id) => {
    const r = restaurants.find(r => r.id === id)
    if (!r) return
    const paidBy = r.nextPayer
    const next = PEOPLE.find(p => p !== paidBy)
    recordPayment(id)
    showToast(`${r.emoji} ${paidBy} a payé ! Prochain : ${next}`)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const stats = getStats(history)

  return (
    <div className="h-full bg-[#0f0f1a] flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex-shrink-0 px-5 pt-12 pb-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">KiPay 🍽️</h1>
            <p className="text-white/40 text-sm mt-0.5">C'est à qui de payer ?</p>
          </div>
          {tab === 'home' && history.length > 0 && (
            <div className="flex gap-3 pb-1">
              {PEOPLE.map(person => (
                <div key={person} className="text-center">
                  <p className="text-white font-bold text-lg leading-none">{stats[person] || 0}</p>
                  <p className="text-white/40 text-xs">{person}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden px-5 pb-2">
        {tab === 'home' && (
          <div className="h-full flex flex-col">
            {restaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-white/40 gap-3 pb-20">
                <span className="text-5xl">🍽️</span>
                <p className="text-lg font-medium">Aucun restaurant</p>
                <p className="text-sm text-center">Ajoutez des restaurants<br/>dans l'onglet "Gérer"</p>
              </div>
            ) : (
              <>
                <p className="text-white/40 text-xs mb-4 text-center">
                  Swipez → pour confirmer le paiement
                </p>
                <div className="overflow-y-auto flex-1 -mr-2 pr-2">
                  {restaurants.map(r => (
                    <RestaurantCard key={r.id} restaurant={r} onPay={handlePay} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'history' && (
          <HistoryView history={history} onClear={clearHistory} />
        )}

        {tab === 'settings' && (
          <SettingsView
            restaurants={restaurants}
            onAdd={addRestaurant}
            onRemove={removeRestaurant}
            onUpdate={updateRestaurant}
            PEOPLE={PEOPLE}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 bg-[#1a1a2e] border-t border-white/5 flex pb-safe">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              tab === t.id ? 'text-white' : 'text-white/30'
            }`}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Toast notification */}
      {toast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl bounce-in z-50 max-w-xs text-center">
          {toast}
        </div>
      )}
    </div>
  )
}
