import { useState } from 'react'

const types = [
  { name: 'Fire', icon: '🔥', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
  { name: 'Water', icon: '💧', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
  { name: 'Grass', icon: '🌿', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { name: 'Ground', icon: '⛰️', color: 'bg-amber-50 text-amber-800 hover:bg-amber-100' },
]

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [result, setResult] = useState(null)

  async function getMatchup(type) {
    try {
      const response = await fetch(`http://localhost:5001/api/type/${type.toLowerCase()}`)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      return { error: error.message }
    }
  }

  async function handleTypeClick(type) {
    setResult(await getMatchup(type))
  }

  function formatTypes(typeNames) {
    if (!typeNames?.length) return 'no listed types'
    if (typeNames.length === 1) return typeNames[0]
    if (typeNames.length === 2) return `${typeNames[0]} and ${typeNames[1]}`
    return `${typeNames.slice(0, -1).join(', ')}, and ${typeNames[typeNames.length - 1]}`
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff] px-5 py-10 text-slate-900 sm:py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-indigo-100 bg-white p-7 shadow-[0_18px_45px_rgba(79,70,229,0.10)] sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-4 border-slate-900 bg-white shadow-sm">
            <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-slate-900" />
            <span className="z-10 h-4 w-4 rounded-full border-4 border-slate-900 bg-white" />
            <span className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500">Trainer toolkit</p>
            <h1 className="text-2xl font-black tracking-tight">Pokémon Battle Assistant</h1>
          </div>
        </div>
        <div className="mb-7 rounded-2xl bg-indigo-50/70 p-5">
          <p className="mb-1 text-sm font-semibold text-indigo-500">Choose your matchup</p>
          <h2 className="text-xl font-bold">What type of Pokémon are you fighting?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {types.map((type) => (
            <button
              className={`rounded-2xl border-2 px-3 py-4 text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-100 ${type.color} ${selectedType === type.name ? 'border-indigo-500 ring-4 ring-indigo-100' : 'border-transparent'}`}
              key={type.name}
              onClick={() => {
                setSelectedType(type.name)
                handleTypeClick(type.name)
              }}
              type="button"
            >
              <span className="mb-1 block text-2xl" aria-hidden="true">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>
        <p className="mt-7 text-center text-sm text-slate-500" aria-live="polite">
          {selectedType ? `You chose ${selectedType}. Let’s find the best counter!` : 'Select a type to get started.'}
        </p>
        {result && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            {result.error ? (
              <p className="text-red-600">We couldn’t load the matchup: {result.error}</p>
            ) : (
              <>
                <p>
                  <strong className="text-slate-900">Use {selectedType}-type attacks carefully:</strong>{' '}
                  they deal half damage to {formatTypes(result.half_damage_to)}.
                </p>
                <p className="mt-3">
                  <strong className="text-slate-900">Look out for:</strong>{' '}
                  {selectedType}-type Pokémon take double damage from {formatTypes(result.double_damage_from)}.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
