import { useState } from 'react'
import { nextPayer } from '../hooks/useStorage'

// 80 food/restaurant emojis grouped by category to avoid duplicates
const EMOJI_CATEGORIES = [
  {
    label: 'Cuisine du monde',
    emojis: ['🍕','🍝','🫕','🥗','🥙','🌮','🌯','🫔','🧆','🥪']
  },
  {
    label: 'Asiatique',
    emojis: ['🍣','🍱','🍜','🍛','🍚','🥟','🍢','🍡','🧋','🥡']
  },
  {
    label: 'Viandes & Poissons',
    emojis: ['🥩','🍗','🍖','🌭','🥓','🦞','🦐','🦑','🍤','🫀']
  },
  {
    label: 'Burgers & Snacks',
    emojis: ['🍔','🍟','🥨','🥚','🧇','🥞','🫓','🥐','🥖','🧀']
  },
  {
    label: 'Boissons',
    emojis: ['🍷','🍸','🍹','🍺','🥂','☕','🧃','🫖','🥛','🧊']
  },
  {
    label: 'Desserts',
    emojis: ['🍰','🎂','🧁','🍮','🍯','🍨','🍦','🍫','🍬','🍭']
  },
  {
    label: 'Fruits & Légumes',
    emojis: ['🥑','🍋','🍇','🍓','🫐','🍑','🌽','🫚','🧅','🌶️']
  },
  {
    label: 'Ambiance resto',
    emojis: ['🍽️','🥄','🍴','🔪','🧂','🫙','🏮','🪔','🕯️','🥢']
  }
]

export default function SettingsView({ restaurants, onAdd, onRemove, onUpdate, PEOPLE }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [editId, setEditId] = useState(null)

  // Track already-used emojis to highlight duplicates
  const usedEmojis = new Set(restaurants.map(r => r.emoji))

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
        <h2 className="text-white font-bold text-base">Gérer les restaurants</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-bnp-green hover:bg-bnp-light text-white rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
          >
            + Ajouter
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bnp-dark border border-bnp-deep rounded-2xl p-4 mb-4 slide-up flex-shrink-0">
          <p className="text-bnp-light text-sm font-semibold mb-3">{editId ? 'Modifier le restaurant' : 'Nouveau restaurant'}</p>

          {/* Emoji picker by category */}
          <div className="mb-3 overflow-y-auto max-h-52">
            {EMOJI_CATEGORIES.map(cat => (
              <div key={cat.label} className="mb-2">
                <p className="text-white/30 text-xs mb-1">{cat.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.emojis.map(e => {
                    const isUsed = usedEmojis.has(e) && e !== emoji
                    return (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        title={isUsed ? 'Déjà utilisé' : ''}
                        className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-all relative ${
                          emoji === e
                            ? 'bg-bnp-green ring-2 ring-bnp-light scale-110'
                            : isUsed
                            ? 'bg-white/5 opacity-40 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-bnp-mid'
                        }`}
                      >
                        {e}
                        {isUsed && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nom du restaurant"
            className="w-full bg-bnp-darker text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bnp-green mb-3 border border-bnp-deep"
            autoFocus
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-bnp-green hover:bg-bnp-light disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
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
          <div className="flex flex-col items-center justify-center py-12 text-white/30 gap-2">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm">Aucun restaurant configuré</p>
          </div>
        ) : (
          <div className="space-y-2">
            {restaurants.map(r => (
              <div key={r.id} className="bg-bnp-dark border border-bnp-deep rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{r.name}</p>
                    <p className="text-bnp-light/70 text-xs">Prochain : {nextPayer(r.counts ?? { Kevin: 0, Emeric: 0 })}</p>
                  </div>
                </div>
                <div className="flex gap-1">
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
