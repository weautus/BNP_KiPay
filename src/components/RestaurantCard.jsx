import { useState } from 'react'

const COLORS = {
  Kevin:  { bg: 'from-bnp-mid to-bnp-deep',   badge: 'bg-bnp-green',  text: 'text-bnp-light' },
  Emeric: { bg: 'from-bnp-teal to-bnp-tealdark', badge: 'bg-bnp-teal', text: 'text-green-300' }
}

export default function RestaurantCard({ restaurant, onPay }) {
  const { name, emoji, nextPayer } = restaurant
  const colors = COLORS[nextPayer] || COLORS.Kevin
  const [flashing, setFlashing] = useState(false)

  const handlePay = () => {
    setFlashing(true)
    setTimeout(() => {
      onPay(restaurant.id)
      setFlashing(false)
    }, 350)
  }

  return (
    <div
      className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-4 mb-3 ${flashing ? 'pay-flash' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: emoji + name */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-4xl leading-none flex-shrink-0">{emoji}</span>
          <div className="min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">{name}</p>
            <p className={`text-xs ${colors.text} mt-0.5`}>
              Prochain : <span className="font-semibold text-white">{nextPayer}</span>
            </p>
          </div>
        </div>

        {/* Right: pay button */}
        <button
          onClick={handlePay}
          className="flex-shrink-0 bg-white text-bnp-deep font-bold text-sm px-4 py-2 rounded-xl hover:bg-bnp-light hover:text-white active:scale-95 transition-all shadow-md"
        >
          ✓ Payé
        </button>
      </div>
    </div>
  )
}
