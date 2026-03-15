import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kipay_data'

export const PEOPLE = ['Kevin', 'Emeric']

const DEFAULT_RESTAURANTS = [
  { id: '1', name: 'Le Bistrot',  emoji: '🍷', counts: { Kevin: 0, Emeric: 0 }, startWith: 'Kevin' },
  { id: '2', name: 'La Pizzeria', emoji: '🍕', counts: { Kevin: 0, Emeric: 0 }, startWith: 'Emeric' },
  { id: '3', name: 'Le Japonais', emoji: '🍣', counts: { Kevin: 0, Emeric: 0 }, startWith: 'Kevin' },
]

// Migrate old format (nextPayer) to new format (counts)
function migrate(restaurants) {
  return restaurants.map((r, i) => {
    const withCounts = r.counts ? r : { ...r, counts: { Kevin: 0, Emeric: 0 }, nextPayer: undefined }
    if (!withCounts.startWith) {
      withCounts.startWith = i % 2 === 0 ? 'Kevin' : 'Emeric'
    }
    return withCounts
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

// The next payer is whoever has the lowest count; startWith breaks ties
export function nextPayer(counts, startWith = 'Kevin') {
  if (counts.Kevin === counts.Emeric) return startWith
  return counts.Kevin < counts.Emeric ? 'Kevin' : 'Emeric'
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
    setData(prev => {
      const last = prev.restaurants[prev.restaurants.length - 1]
      const startWith = last?.startWith === 'Kevin' ? 'Emeric' : 'Kevin'
      return {
        ...prev,
        restaurants: [...prev.restaurants, {
          id: Date.now().toString(),
          name: name.trim(),
          emoji,
          counts: { Kevin: 0, Emeric: 0 },
          startWith
        }]
      }
    })
  }

  const reorderRestaurant = (id, direction) => {
    setData(prev => {
      const list = [...prev.restaurants]
      const idx = list.findIndex(r => r.id === id)
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= list.length) return prev
      ;[list[idx], list[target]] = [list[target], list[idx]]
      return { ...prev, restaurants: list }
    })
  }

  const resetCounts = (id) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(r =>
        r.id === id ? { ...r, counts: { Kevin: 0, Emeric: 0 } } : r
      )
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
    reorderRestaurant,
    resetCounts,
    clearHistory,
    PEOPLE
  }
}
