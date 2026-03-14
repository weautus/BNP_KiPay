import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kipay_data'

const PEOPLE = ['Kevin', 'Emeric']

const DEFAULT_RESTAURANTS = [
  { id: '1', name: 'Le Bistrot', emoji: '🍷', nextPayer: 'Kevin' },
  { id: '2', name: 'La Pizzeria', emoji: '🍕', nextPayer: 'Emeric' },
  { id: '3', name: 'Le Japonais', emoji: '🍣', nextPayer: 'Kevin' },
]

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useStorage() {
  const [data, setData] = useState(() => {
    const stored = loadData()
    if (stored) return stored
    return { restaurants: DEFAULT_RESTAURANTS, history: [] }
  })

  useEffect(() => {
    saveData(data)
  }, [data])

  const otherPerson = (person) => PEOPLE.find(p => p !== person)

  // Record that nextPayer paid, update nextPayer to the other person
  const recordPayment = (restaurantId) => {
    setData(prev => {
      const restaurant = prev.restaurants.find(r => r.id === restaurantId)
      if (!restaurant) return prev

      const paidBy = restaurant.nextPayer
      const newNextPayer = otherPerson(paidBy)

      const historyEntry = {
        id: Date.now().toString(),
        restaurantId,
        restaurantName: restaurant.name,
        restaurantEmoji: restaurant.emoji,
        paidBy,
        date: new Date().toISOString()
      }

      return {
        restaurants: prev.restaurants.map(r =>
          r.id === restaurantId ? { ...r, nextPayer: newNextPayer } : r
        ),
        history: [historyEntry, ...prev.history]
      }
    })
  }

  const addRestaurant = (name, emoji) => {
    const newRestaurant = {
      id: Date.now().toString(),
      name: name.trim(),
      emoji,
      nextPayer: 'Kevin'
    }
    setData(prev => ({
      ...prev,
      restaurants: [...prev.restaurants, newRestaurant]
    }))
  }

  const removeRestaurant = (id) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.filter(r => r.id !== id)
    }))
  }

  const updateRestaurant = (id, changes) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(r =>
        r.id === id ? { ...r, ...changes } : r
      )
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
