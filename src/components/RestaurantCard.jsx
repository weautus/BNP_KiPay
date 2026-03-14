import { useRef, useState } from 'react'

const SWIPE_THRESHOLD = 80
const COLORS = {
  Kevin: { bg: 'from-blue-600 to-blue-800', badge: 'bg-blue-500', text: 'text-blue-200' },
  Emeric: { bg: 'from-purple-600 to-purple-800', badge: 'bg-purple-500', text: 'text-purple-200' }
}

export default function RestaurantCard({ restaurant, onPay }) {
  const { name, emoji, nextPayer } = restaurant
  const colors = COLORS[nextPayer] || COLORS.Kevin

  const touchStart = useRef(null)
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
    setSwiping(true)
  }

  const handleTouchMove = (e) => {
    if (touchStart.current === null) return
    const dx = e.touches[0].clientX - touchStart.current
    // Only allow rightward swipe
    if (dx > 0) setOffset(dx)
  }

  const handleTouchEnd = () => {
    if (offset >= SWIPE_THRESHOLD) {
      triggerPayment()
    } else {
      setOffset(0)
    }
    setSwiping(false)
    touchStart.current = null
  }

  const triggerPayment = () => {
    setConfirmed(true)
    setOffset(0)
    setTimeout(() => {
      onPay(restaurant.id)
      setConfirmed(false)
    }, 600)
  }

  const progress = Math.min(offset / SWIPE_THRESHOLD, 1)
  const opacity = confirmed ? 0 : 1 - progress * 0.3

  return (
    <div className="relative overflow-hidden rounded-2xl select-none mb-3">
      {/* Swipe hint background */}
      <div
        className="absolute inset-0 flex items-center justify-start pl-6 rounded-2xl"
        style={{
          background: `rgba(34, 197, 94, ${progress * 0.9})`,
          transition: swiping ? 'none' : 'background 0.15s'
        }}
      >
        <span className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">✓</span>
          {progress >= 1 ? 'Validé !' : 'Swipe pour confirmer'}
        </span>
      </div>

      {/* Card */}
      <div
        className={`swipe-card ${swiping ? 'swiping' : ''} relative bg-gradient-to-r ${colors.bg} rounded-2xl p-4 cursor-grab active:cursor-grabbing`}
        style={{
          transform: `translateX(${confirmed ? '100%' : offset}px)`,
          opacity,
          transition: confirmed ? 'transform 0.3s ease, opacity 0.3s ease' : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between">
          {/* Left: emoji + name */}
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{emoji}</span>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{name}</p>
              <p className={`text-sm ${colors.text} mt-0.5`}>Prochain restaurant</p>
            </div>
          </div>

          {/* Right: who pays */}
          <div className="flex flex-col items-end gap-2">
            <div className={`${colors.badge} rounded-full px-3 py-1`}>
              <p className="text-white font-bold text-sm">{nextPayer}</p>
            </div>
            <p className="text-white/50 text-xs">👈 swipe</p>
          </div>
        </div>
      </div>
    </div>
  )
}
