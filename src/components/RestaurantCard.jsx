import { useState } from 'react'
import { nextPayer } from '../hooks/useStorage'

export default function RestaurantCard({ restaurant, onPay }) {
  const { name, emoji, counts, startWith } = restaurant
  const next = nextPayer(counts, startWith)
  const [flashing, setFlashing] = useState(null) // person name being flashed

  const handlePay = (person) => {
    setFlashing(person)
    setTimeout(() => {
      onPay(restaurant.id, person)
      setFlashing(null)
    }, 300)
  }

  return (
    <div className="bg-bnp-dark border border-bnp-deep rounded-2xl p-4 mb-3">
      {/* Restaurant name + emoji */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl leading-none">{emoji}</span>
        <p className="text-white font-bold text-base">{name}</p>
      </div>

      {/* Two pay buttons */}
      <div className="flex gap-2">
        {['Kevin', 'Emeric'].map(person => {
          const isNext = person === next
          const isFlashing = flashing === person
          return (
            <button
              key={person}
              onClick={() => handlePay(person)}
              className={`flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                isNext
                  ? 'bg-bnp-green text-white shadow-md'
                  : 'bg-bnp-darker border border-bnp-deep text-white/50 hover:text-white hover:border-bnp-mid'
              } ${isFlashing ? 'pay-flash' : ''}`}
            >
              <span>{person}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${isNext ? 'bg-white/20' : 'bg-white/10'}`}>
                {counts[person] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Next payer hint */}
      <p className="text-white/30 text-xs mt-2 text-right">
        Prochain : <span className="text-bnp-light font-semibold">{next}</span>
      </p>
    </div>
  )
}
