import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kipay_data'

export const PEOPLE = ['Kevin', 'Emeric']

const DEFAULT_RESTAURANTS = [
  { id: '1', name: 'Le Bistrot',  emoji: '🍷', counts: { Kevin: 0, Emeric: 0 } },
  { id: '2', name: 'La Pizzeria', emoji: '🍕', counts: { Kevin: 0, Emeric: 0 } },
  { id: '3', name: 'Le Japonais', emoji: '🍣', counts: { Kevin: 0, Emeric: 0 } },
]

// Migrate old format (nextPayer) to new format (counts)
function migrate(restaurants) {
  return restaurants.map(r => {
    if (r.counts) return r
    return { ...r, counts: { Kevin: 0, Emeric: 0 }, nextPayer: undefined }
  })
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return { ...data, restaurants: migrate(data.restaurants) }
  } catch {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// The next payer is whoever has the lowest count (Kevin wins ties)
export function nextPayer(counts) {
  return counts.Kevin <= counts.Emeric ? 'Kevin' : 'Emeric'
}

export function useStorage() {
  const [data, setData] = useState(() => {
    return loadData() ?? { restaurants: DEFAULT_RESTAURANTS, history: [] }
  })

  useEffect(() => { saveData(data) }, [data])

  const recordPayment = (restaurantId, person) => {
    setData(prev => {
      const restaurant = prev.restaurants.find(r => r.id === restaurantId)
      if (!restaurant) return prev

      const historyEntry = {
        id: Date.now().toString(),
        restaurantId,
        restaurantName: restaurant.name,
        restaurantEmoji: restaurant.emoji,
        paidBy: person,
        date: new Date().toISOString()
      }

      return {
        restaurants: prev.restaurants.map(r =>
          r.id === restaurantId
            ? { ...r, counts: { ...r.counts, [person]: (r.counts[person] || 0) + 1 } }
            : r
        ),
        history: [historyEntry, ...prev.history]
      }
    })
  }

  const addRestaurant = (name, emoji) => {
    setData(prev => ({
      ...prev,
      restaurants: [...prev.restaurants, {
        id: Date.now().toString(),
        name: name.trim(),
        emoji,
        counts: { Kevin: 0, Emeric: 0 }
      }]
    }))
  }

  const removeRestaurant = (id) => {
    setData(prev => ({ ...prev, restaurants: prev.restaurants.filter(r => r.id !== id) }))
  }

  const updateRestaurant = (id, changes) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(r => r.id === id ? { ...r, ...changes } : r)
    }))
  }

  const clearHistory = () => {
    setData(prev => ({ ...prev, history: [] }))
  }

  return {
    restaurants: data.restaurants,
    history: data.history,
    recordPayment,
    addRestaurant,
    removeRestaurant,
    updateRestaurant,
    clearHistory,
    PEOPLE
  }
}
