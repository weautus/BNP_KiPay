import { useState } from 'react'
import { useStorage } from './hooks/useStorage'
import RestaurantCard from './components/RestaurantCard'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'

const TABS = [
  { id: 'home',     label: 'Restaurants', icon: '🍽️' },
  { id: 'history',  label: 'Historique',  icon: '📋' },
  { id: 'settings', label: 'Gérer',       icon: '⚙️' }
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [toast, setToast] = useState(null)
  const {
    restaurants, history,
    recordPayment, addRestaurant, removeRestaurant, updateRestaurant, reorderRestaurant, resetCounts, clearHistory,
    PEOPLE
  } = useStorage()

  const handlePay = (id, person) => {
    const r = restaurants.find(r => r.id === id)
    if (!r) return
    recordPayment(id, person)
    showToast(`${r.emoji} ${person} a payé !`)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="h-full bg-bnp-darker flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <header className="flex-shrink-0 bg-bnp-dark px-5 pt-10 pb-4 border-b border-bnp-deep">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 bg-bnp-green rounded-full" />
          <div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">KiPay</h1>
            <p className="text-white/40 text-xs mt-0.5">C'est à qui de payer ?</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden px-5 pt-4 pb-2">
        {tab === 'home' && (
          <div className="h-full flex flex-col">
            {restaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-white/30 gap-3 pb-20">
                <span className="text-5xl">🍽️</span>
                <p className="text-white/60 text-lg font-semibold">Aucun restaurant</p>
                <p className="text-sm text-center">Ajoutez des restaurants<br/>dans l'onglet "Gérer"</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 -mr-2 pr-2">
                {restaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} onPay={handlePay} />
                ))}
              </div>
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
            onReorder={reorderRestaurant}
            onReset={resetCounts}
            PEOPLE={PEOPLE}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 bg-bnp-dark border-t border-bnp-deep flex">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors relative ${
              tab === t.id ? 'text-bnp-light' : 'text-white/30'
            }`}
          >
            {tab === t.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-bnp-green rounded-full" />
            )}
            <span className="text-xl leading-none">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Toast */}
      {toast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-bnp-green text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl bounce-in z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}
