import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllCharacters, deleteCharacter } from '../api/characters'

export default function CharactersList() {
  const [chars, setChars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCharacters()
        setChars(data)
      } catch (e) {
        console.error(e)
        setError("The vault is sealed. (Failed to load characters)")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Banish this hero from the vault?')) return
    try {
      await deleteCharacter(id)
      setChars(chars.filter(c => c.id !== id))
    } catch (e) {
      alert('The hero resists banishment! (Delete failed)')
    }
  }

  if (loading) return <p style={{fontFamily: 'MedievalSharp', textAlign: 'center'}}>Opening the vault doors...</p>

  if (error) return (
    <div style={{textAlign: 'center', color: 'var(--accent-red)', padding: '2rem'}}>
      <h2 style={{border: 'none'}}>{error}</h2>
      <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
    </div>
  )

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2 style={{border: 'none', margin: 0}}>The Hero Vault</h2>
        <Link to="/new" className="btn">Forge New Hero</Link>
      </div>

      <div className="grid">
        {chars.map(c => (
          <article key={c.id} className="card">
            <div>
              <h3>{c.name || 'Unnamed Soul'}</h3>
              <p className="muted">{c.characterClass || 'Classless'} • Level {c.level ?? 1}</p>
              <div style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
                <strong>HP:</strong> {c.lifePoints}/{c.maxLifePoints} |
                <strong> Gold:</strong> {c.gold}gp
              </div>
            </div>
            <div className="card-actions">
              <Link to={`/characters/${c.id}`} className="btn small">View</Link>
              <button className="btn small" onClick={() => navigate(`/edit/${c.id}`)}>Edit</button>
              <button className="btn danger small" onClick={() => handleDelete(c.id)}>Banish</button>
            </div>
          </article>
        ))}
      </div>

      {chars.length === 0 && (
        <div style={{textAlign: 'center', padding: '4rem 0'}}>
          <p style={{fontFamily: 'MedievalSharp', fontSize: '1.2rem'}}>The vault is empty. No heroes have been forged yet.</p>
          <Link to="/new" className="btn" style={{marginTop: '1rem'}}>Begin Your Legend</Link>
        </div>
      )}
    </div>
  )
}
