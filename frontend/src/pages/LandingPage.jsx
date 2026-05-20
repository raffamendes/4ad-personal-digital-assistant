import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <img
          src="/images/homepage/shield-homepage.png"
          alt="4AD Adventure"
          style={{
            maxWidth: '100%',
            maxHeight: '400px',
            borderRadius: '8px',
            border: '4px solid var(--accent-gold)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
          onError={(e) => { e.target.style.display = 'none' }} // Hide if image doesn't exist yet
        />
      </div>

      <h1 style={{
        fontFamily: 'Pirata One',
        fontSize: '4rem',
        marginBottom: '1rem',
        color: 'var(--accent-red)',
        textShadow: '2px 2px 0px var(--accent-gold)',
        marginTop: 0
      }}>
        4AD CHARACTER VAULT
      </h1>

      <p style={{
        fontFamily: 'MedievalSharp',
        fontSize: '1.5rem',
        maxWidth: '600px',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        Welcome, adventurer. Here you may record the deeds and stats of your heroes
        venturing into the dark corners of the world.
      </p>

      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link to="/new" className="btn" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
          Forge New Hero
        </Link>

        <Link to="/list" className="btn" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem', backgroundColor: 'var(--accent-gold)', color: 'black' }}>
          Enter the Vault
        </Link>

        <Link to="/party" className="btn" style={{ padding: '1.5rem 3rem', fontSize: '1.2rem', backgroundColor: '#5d4037', color: 'white' }}>
          Assemble Party
        </Link>
      </div>
    </div>
  )
}
