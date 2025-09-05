import React, { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

export function StateSelector({ onSelect }) {
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedState) {
      onSelect(selectedState)
    }
  }

  return (
    <div className="bg-dark-surface p-6 rounded-xl border border-dark-border">
      <div className="text-center mb-6">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Select Your State</h2>
        <p className="text-dark-muted text-sm">
          We'll provide state-specific legal rights information tailored to your location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search for your state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="max-h-48 overflow-y-auto border border-dark-border rounded-lg">
          {filteredStates.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setSelectedState(state)}
              className={`w-full text-left px-4 py-3 hover:bg-dark-border/50 transition-colors ${
                selectedState === state ? 'bg-primary/20 text-primary' : 'text-white'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!selectedState}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Continue to RightGuard
        </button>
      </form>
    </div>
  )
}