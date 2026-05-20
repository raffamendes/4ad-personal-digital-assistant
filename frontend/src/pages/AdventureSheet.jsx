import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characters'

export default function AdventureSheet() {
  const [party, setParty] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const activePartyIds = JSON.parse(localStorage.getItem('active_party') || '[]')
    if (activePartyIds.length === 0) {
      navigate('/party')
      return
    }

    async function loadParty() {
      try {
        const fullParty = await Promise.all(activePartyIds.map(id => getCharacter(id)))
        // Ensure spells is an array for each character
        const sanitizedParty = fullParty.map(c => ({
            ...c,
            spells: Array.isArray(c.spells) ? c.spells : []
        }))
        setParty(sanitizedParty)
      } catch (err) {
        console.error("Failed to load party", err)
      } finally {
        setLoading(false)
      }
    }

    loadParty()
  }, [navigate])

  function updateStat(charIndex, field, delta) {
    const newParty = [...party]
    const char = { ...newParty[charIndex] }

    if (typeof char[field] === 'number') {
      char[field] = Math.max(0, char[field] + delta)
    }

    newParty[charIndex] = char
    setParty(newParty)
  }

  function handleFieldChange(charIndex, field, value) {
    const newParty = [...party]
    newParty[charIndex] = { ...newParty[charIndex], [field]: value }
    setParty(newParty)
  }

  function toggleSpellUse(charIndex, spellIndex, useIndex) {
    const newParty = [...party]
    const char = { ...newParty[charIndex] }
    const newSpells = [...char.spells]
    const spell = { ...newSpells[spellIndex] }

    // If we click on a box that is already 'used' (currentUses <= useIndex), we 'restore' it (set currentUses to useIndex)
    // If we click on a box that is 'available', we 'use' it (set currentUses to useIndex)
    // Actually, let's just make it simple: currentUses is the number of boxes LEFT.
    // So if maxUses is 3, and currentUses is 2, it means 1 is used.
    // Better: checkboxes represent AVAILABLE slots.

    if (useIndex < spell.currentUses) {
        spell.currentUses = useIndex; // Use all slots from here up
    } else {
        spell.currentUses = useIndex + 1; // Restore all slots up to here
    }

    newSpells[spellIndex] = spell
    char.spells = newSpells
    newParty[charIndex] = char
    setParty(newParty)
  }

  async function saveAll() {
    setSaving(true)
    try {
      await Promise.all(party.map(char => updateCharacter(char.id, char)))
      alert('Chronicles saved to the vault!')
    } catch (err) {
      alert('Failed to save party progress.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading the expedition details...</p>

  return (
    <div className="adventure-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Pirata One', fontSize: '2.5rem', color: 'var(--accent-red)', margin: 0 }}>ACTIVE EXPEDITION</h1>

        <div>
          <button className="btn" onClick={saveAll} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Progress'}
          </button>
          <button className="btn danger" style={{ marginLeft: '10px' }} onClick={() => navigate('/party')}>
            End Adventure
          </button>
        </div>
      </header>

      <div className="adventure-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {party.map((c, idx) => (
          <article key={c.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem', borderBottom: '2px solid var(--accent-red)' }}>{c.name}</h3>
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{c.characterClass} (Lvl {c.level})</p>

            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold' }}>HP: {c.lifePoints}/{c.maxLifePoints}</span>
              <div>
                <button className="btn small" onClick={() => updateStat(idx, 'lifePoints', -1)}>-</button>
                <button className="btn small" onClick={() => updateStat(idx, 'lifePoints', 1)}>+</button>
              </div>
            </div>

            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold' }}>Gold: {c.gold}</span>
              <div>
                <button className="btn small" onClick={() => updateStat(idx, 'gold', -1)}>-</button>
                <button className="btn small" onClick={() => updateStat(idx, 'gold', 1)}>+</button>
              </div>
            </div>

            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold' }}>XP: {c.xp}</span>
              <div>
                <button className="btn small" onClick={() => updateStat(idx, 'xp', 1)}>+</button>
              </div>
            </div>

            <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold' }}>Clues: {c.clues}</span>
              <div>
                <button className="btn small" onClick={() => updateStat(idx, 'clues', -1)}>-</button>
                <button className="btn small" onClick={() => updateStat(idx, 'clues', 1)}>+</button>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontFamily: 'MedievalSharp', color: 'var(--accent-red)', fontWeight: 'bold' }}>SPELLS / USES</label>
              <div style={{ marginBottom: '1rem' }}>
                {c.spells.length > 0 ? c.spells.map((s, sIdx) => (
                  <div key={sIdx} style={{ marginBottom: '5px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{s.name}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: s.maxUses }).map((_, uIdx) => (
                                <input
                                    key={uIdx}
                                    type="checkbox"
                                    checked={uIdx < s.currentUses}
                                    onChange={() => toggleSpellUse(idx, sIdx, uIdx)}
                                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>
                  </div>
                )) : <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>No spells prepared</div>}
              </div>

              <label style={{ fontSize: '0.8rem', fontFamily: 'MedievalSharp', color: 'var(--accent-red)', fontWeight: 'bold' }}>TRAITS</label>
              <div style={{
                background: 'rgba(0,0,0,0.05)',
                padding: '0.5rem',
                fontSize: '0.85rem',
                minHeight: '40px',
                border: '1px solid rgba(0,0,0,0.1)',
                marginBottom: '0.5rem'
              }}>
                {c.traits || 'None'}
              </div>

              <label style={{ fontSize: '0.8rem', fontFamily: 'MedievalSharp', color: 'var(--accent-red)', fontWeight: 'bold' }}>EQUIPMENT</label>
              <textarea
                value={c.equipment || ''}
                onChange={(e) => handleFieldChange(idx, 'equipment', e.target.value)}
                style={{ width: '100%', height: '60px', fontSize: '0.85rem', marginTop: '2px', background: 'rgba(255,255,255,0.3)', border: '1px solid var(--border-color)' }}
                placeholder="Adjust equipment..."
              />

              <label style={{ fontSize: '0.8rem', fontFamily: 'MedievalSharp', color: 'var(--accent-red)', fontWeight: 'bold', marginTop: '0.5rem', display: 'block' }}>NOTES / JOURNAL</label>
              <textarea
                value={c.notes || ''}
                onChange={(e) => handleFieldChange(idx, 'notes', e.target.value)}
                style={{ width: '100%', height: '80px', fontSize: '0.85rem', marginTop: '2px', background: 'rgba(255,255,255,0.3)', border: '1px solid var(--border-color)' }}
                placeholder="Session notes..."
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
