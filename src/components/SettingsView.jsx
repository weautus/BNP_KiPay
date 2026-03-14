import { useState } from 'react'

const EMOJI_SUGGESTIONS = [
  '🍕','🍣','🍜','🍔','🌮','🥗','🍷','🍺','🥩','🍝',
  '🥘','🍛','🍱','🫕','🥙','🫔','🍞','🧆','🥞','🫖',
  '🍤','🦞','🦐','🍗','🥟','🍢','🍡','🧋','☕','🎂'
]

export default function SettingsView({ restaurants, onAdd, onRemove, onUpdate, PEOPLE }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [editId, setEditId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (editId) {
      onUpdate(editId, { name: name.trim(), emoji })
      setEditId(null)
    } else {
      onAdd(name, emoji)
    }
    setName('')
    setEmoji('🍽️')
    setShowForm(false)
  }

  const startEdit = (r) => {
    setEditId(r.id)
    setName(r.name)
    setEmoji(r.emoji)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditId(null)
    setName('')
    setEmoji('🍽️')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-white font-bold text-lg">Restaurants</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-3 py-1.5 text-sm font-medium transition-colors"
          >
            + Ajouter
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-4 mb-4 slide-up flex-shrink-0">
          <p className="text-white/70 text-sm mb-3">{editId ? 'Modifier' : 'Nouveau restaurant'}</p>

          {/* Emoji picker */}
          <div className="mb-3">
            <p className="text-white/50 text-xs mb-2">Emoji</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    emoji === e ? 'bg-white/30 ring-2 ring-white/60' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nom du restaurant"
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 mb-3"
            autoFocus
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="overflow-y-auto flex-1 -mr-2 pr-2">
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/40 gap-2">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm">Aucun restaurant</p>
          </div>
        ) : (
          <div className="space-y-2">
            {restaurants.map(r => (
              <div key={r.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{r.name}</p>
                    <p className="text-white/40 text-xs">Prochain : {r.nextPayer}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Toggle next payer */}
                  <button
                    onClick={() => onUpdate(r.id, { nextPayer: PEOPLE.find(p => p !== r.nextPayer) })}
                    className="text-white/40 hover:text-white/80 text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                    title="Changer qui paye"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => startEdit(r)}
                    className="text-white/40 hover:text-white/80 text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemove(r.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
