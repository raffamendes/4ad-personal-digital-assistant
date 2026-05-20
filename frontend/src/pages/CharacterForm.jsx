import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCharacter, getCharacter, updateCharacter } from '../api/characters'

const empty = {
  name: '',
  characterClass: '',
  level: 1,
  lifePoints: 0,
  maxLifePoints: 0,
  attackBonus: 0,
  defenseBonus: 0,
  gold: 0,
  xp: 0,
  clues: 0,
  equipment: '',
  spells: [],
  traits: '',
  notes: ''
}

export default function CharacterForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(editing)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!editing) return
    getCharacter(id)
      .then(data => {
        setForm({
            ...empty,
            ...data,
            spells: Array.isArray(data.spells) ? data.spells : []
        });
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load character", err)
        navigate('/')
      })
  }, [id, navigate, editing])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: isNumberField(name) ? Number(value) : value }))
  }

  function isNumberField(name) {
    return ['level','lifePoints','maxLifePoints','attackBonus','defenseBonus','gold','xp', 'clues'].includes(name)
  }

  const addSpell = () => {
    setForm(prev => ({
      ...prev,
      spells: [...prev.spells, { name: '', maxUses: 1, currentUses: 1 }]
    }))
  }

  const removeSpell = (index) => {
    setForm(prev => ({
      ...prev,
      spells: prev.spells.filter((_, i) => i !== index)
    }))
  }

  const updateSpell = (index, field, value) => {
    const newSpells = [...form.spells]
    newSpells[index] = { ...newSpells[index], [field]: field === 'maxUses' ? Number(value) : value }
    if (field === 'maxUses') newSpells[index].currentUses = Number(value)
    setForm(prev => ({ ...prev, spells: newSpells }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (editing) {
        await updateCharacter(id, form)
        alert('Character updated in the vault!')
      } else {
        await createCharacter(form)
        alert('Character forged successfully!')
      }
      navigate('/list')
    } catch (err) {
      console.error("Save failed details:", err)
      setError(err.message || 'Save failed. Check console for details.')
    }
  }

  if (loading) return <p>Loading Character Folio…</p>

  return (
    <div>
      {error && (
        <div style={{
          background: 'rgba(139, 0, 0, 0.1)',
          border: '1px solid var(--accent-red)',
          padding: '1rem',
          marginBottom: '1rem',
          color: 'var(--accent-red)',
          fontFamily: 'MedievalSharp'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <form className="form" onSubmit={onSubmit}>
        <label className="full-width">Name <input name="name" value={form.name} onChange={onChange} required /></label>
        <label>Class <input name="characterClass" value={form.characterClass} onChange={onChange} required /></label>
        <label>Level <input name="level" type="number" min="1" value={form.level} onChange={onChange} /></label>

        <div className="row">
          <label>Current HP <input name="lifePoints" type="number" value={form.lifePoints} onChange={onChange} /></label>
          <label>Max HP <input name="maxLifePoints" type="number" value={form.maxLifePoints} onChange={onChange} /></label>
        </div>

        <div className="row">
          <label>Attack Bonus <input name="attackBonus" type="number" value={form.attackBonus} onChange={onChange} /></label>
          <label>Defense Bonus <input name="defenseBonus" type="number" value={form.defenseBonus} onChange={onChange} /></label>
        </div>

        <div className="row">
          <label>Gold <input name="gold" type="number" value={form.gold} onChange={onChange} /></label>
          <label>XP <input name="xp" type="number" value={form.xp} onChange={onChange} /></label>
          <label>Clues <input name="clues" type="number" value={form.clues} onChange={onChange} /></label>
        </div>

        <label className="full-width">Equipment <textarea name="equipment" value={form.equipment} onChange={onChange} rows="2" /></label>

        <div className="full-width" style={{ border: '1px solid var(--border-color)', padding: '1rem', background: 'rgba(0,0,0,0.05)' }}>
            <h3 style={{ border: 'none', margin: 0, fontSize: '1.2rem' }}>SPELLS / BLESSINGS</h3>
            {form.spells.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'flex-end' }}>
                    <label style={{ flex: 3 }}>Spell Name
                        <input value={s.name} onChange={e => updateSpell(idx, 'name', e.target.value)} />
                    </label>
                    <label style={{ flex: 1 }}>Uses
                        <input type="number" min="1" value={s.maxUses} onChange={e => updateSpell(idx, 'maxUses', e.target.value)} />
                    </label>
                    <button type="button" className="btn danger small" onClick={() => removeSpell(idx)}>Remove</button>
                </div>
            ))}
            <button type="button" className="btn small" style={{ marginTop: '15px' }} onClick={addSpell}>+ Add Spell Slot</button>
        </div>

        <label className="full-width">Traits <textarea name="traits" value={form.traits} onChange={onChange} rows="3" placeholder="Expanded Edition Traits" /></label>
        <label className="full-width">Notes <textarea name="notes" value={form.notes} onChange={onChange} rows="4" /></label>

        <div className="form-actions full-width">
          <button className="btn" type="submit">{editing ? 'Save Sheet' : 'Forge Character'}</button>
          <button type="button" className="btn danger" onClick={() => navigate(-1)} style={{marginLeft: '10px'}}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
