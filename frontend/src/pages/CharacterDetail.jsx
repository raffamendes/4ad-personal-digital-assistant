import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCharacter, deleteCharacter } from '../api/characters'

export default function CharacterDetail() {
  const { id } = useParams()
  const [c, setC] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCharacter(id).then(setC).catch(() => navigate('/'))
  }, [id, navigate])

  const getClassImage = (className) => {
    if (!className) return 'https://www.svgrepo.com/show/422394/character-avatar-man.svg'; // Fallback
    const slug = className.toLowerCase().trim().replace(/\s+/g, '-');
    return `/images/classes/${slug}.png`;
  };

  async function onDelete() {
    if (!confirm('Destroy this character record forever?')) return
    try {
      await deleteCharacter(id)
      navigate('/')
    } catch {
      alert('Action failed')
    }
  }

  if (!c) return <p>Loading Character Folio…</p>

  return (
    <div className="detail">
      <header className="detail-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
          <div style={{
            width: '120px',
            height: '120px',
            border: '3px solid var(--accent-gold)',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.2)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <img
              src={getClassImage(c.characterClass)}
              alt={c.characterClass}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://www.svgrepo.com/show/422394/character-avatar-man.svg' }}
            />
          </div>
          <div>
            <h2 style={{fontSize: '2.5rem', marginBottom: '0.2rem'}}>{c.name}</h2>
            <p style={{fontFamily: 'MedievalSharp', fontSize: '1.2rem', color: 'var(--accent-red)', margin: 0}}>
              Level {c.level} {c.characterClass}
            </p>
          </div>
        </div>
        <div>
          <Link to={`/edit/${c.id}`} className="btn">Edit</Link>
          <button className="btn danger" onClick={onDelete} style={{marginLeft: '10px'}}>Delete</button>
        </div>
      </header>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', margin: '30px 0'}}>
         <div className="stat-box">
            <span style={{fontSize: '0.7rem', fontFamily: 'MedievalSharp'}}>HP</span>
            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{c.lifePoints}/{c.maxLifePoints}</span>
         </div>
         <div className="stat-box">
            <span style={{fontSize: '0.7rem', fontFamily: 'MedievalSharp'}}>ATK</span>
            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{c.attackBonus >= 0 ? `+${c.attackBonus}` : c.attackBonus}</span>
         </div>
         <div className="stat-box">
            <span style={{fontSize: '0.7rem', fontFamily: 'MedievalSharp'}}>DEF</span>
            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{c.defenseBonus >= 0 ? `+${c.defenseBonus}` : c.defenseBonus}</span>
         </div>
         <div className="stat-box">
            <span style={{fontSize: '0.7rem', fontFamily: 'MedievalSharp'}}>GOLD</span>
            <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{c.gold}</span>
         </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
        <div>
          <h3>Abilities & Traits</h3>
          <p style={{background: 'rgba(0,0,0,0.05)', padding: '1rem', border: '1px solid var(--border-color)', minHeight: '80px'}}>
            {c.traits || 'No special traits recorded.'}
          </p>

          <h3>Spells / Blessings</h3>
          <div style={{background: 'rgba(0,0,0,0.05)', padding: '1rem', border: '1px solid var(--border-color)', minHeight: '80px'}}>
            {Array.isArray(c.spells) && c.spells.length > 0 ? (
                c.spells.map((s, i) => (
                    <div key={i} style={{ marginBottom: '5px' }}>
                        <strong>{s.name}</strong>: {s.maxUses} uses
                    </div>
                ))
            ) : (
                <p style={{ margin: 0 }}>No spells prepared.</p>
            )}
          </div>
        </div>

        <div>
          <h3>Equipment</h3>
          <p style={{background: 'rgba(0,0,0,0.05)', padding: '1rem', border: '1px solid var(--border-color)', minHeight: '80px'}}>
            {c.equipment || 'No equipment.'}
          </p>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
             <div className="detail-item"><dt>Experience</dt><dd>{c.xp} XP</dd></div>
             <div className="detail-item"><dt>Clues</dt><dd>{c.clues || 0}</dd></div>
          </div>
        </div>
      </div>

      <div style={{marginTop: '2rem'}}>
        <h3>Chronicles / Notes</h3>
        <p style={{background: 'rgba(0,0,0,0.05)', padding: '1rem', border: '1px solid var(--border-color)', minHeight: '100px'}}>
          {c.notes || 'The journey begins here...'}
        </p>
      </div>
    </div>
  )
}
