import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCharacters } from '../api/characters'

export default function PartySelection() {
  const [chars, setChars] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getAllCharacters().then(data => {
      setChars(data)
      setLoading(false)
    })
  }, [])

  function toggleCharacter(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id))
    } else {
      if (selected.length < 4) {
        setSelected([...selected, id])
      }
    }
  }

  function startAdventure() {
    if (selected.length === 0) return alert('Select at least one hero!')
    // Store selected party in localStorage to access on the adventure page
    localStorage.setItem('active_party', JSON.stringify(selected))
    navigate('/adventure')
  }

  if (loading) return <p>Gathering the heroes...</p>

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Pirata One', fontSize: '3rem', color: 'var(--accent-red)' }}>ASSEMBLE YOUR PARTY</h1>
      <p style={{ fontFamily: 'MedievalSharp', marginBottom: '2rem' }}>Choose up to 4 heroes for your journey ({selected.length}/4)</p>

      <div className="grid">
        {chars.map(c => {
          const isSelected = selected.includes(c.id)
          return (
            <article
              key={c.id}
              className={`card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCharacter(c.id)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '3px solid var(--accent-gold)' : '2px solid var(--border-color)',
                opacity: isSelected ? 1 : 0.8,
                transform: isSelected ? 'scale(1.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <h3>{c.name}</h3>
              <p className="muted">{c.characterClass} • Level {c.level}</p>
              {isSelected && <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>SELECTED</div>}
            </article>
          )
        })}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <button
          className="btn"
          disabled={selected.length === 0}
          onClick={startAdventure}
          style={{ padding: '1.5rem 4rem', fontSize: '1.5rem', opacity: selected.length === 0 ? 0.5 : 1 }}
        >
          START ADVENTURE
        </button>
      </div>

      {chars.length === 0 && (
        <p>Your vault is empty! Go forge some heroes first.</p>
      )}
    </div>
  )
}
