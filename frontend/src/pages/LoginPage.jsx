import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(username, password);
            if (onLogin) onLogin(); // Notify App.js that a login happened
            navigate('/');
        } catch (err) {
            setError('The password was incorrect or the user does not exist.');
        }
    }

    return (
        <div style={{
            maxWidth: '450px',
            margin: '60px auto',
            padding: '3rem',
            background: 'var(--dark-parchment)',
            border: '3px double var(--border-color)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }}></div>
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }}></div>

            <h2 style={{
                textAlign: 'center',
                fontFamily: 'Pirata One',
                fontSize: '3rem',
                color: 'var(--accent-red)',
                borderBottom: '2px solid var(--accent-red)',
                marginBottom: '2rem',
                paddingBottom: '0.5rem'
            }}>
                IDENTIFY YOURSELF
            </h2>

            {error && (
                <p style={{
                    color: 'white',
                    background: 'var(--accent-red)',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontFamily: 'MedievalSharp',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--accent-gold)'
                }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <label style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}
                    />
                </label>

                <label style={{ fontFamily: 'MedievalSharp', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ padding: '0.8rem', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}
                    />
                </label>

                <button type="submit" className="btn" style={{
                    width: '100%',
                    marginTop: '1rem',
                    fontSize: '1.2rem',
                    padding: '1rem',
                    boxShadow: '0 4px 0px #5d0000'
                }}>
                    Enter the Vault
                </button>
            </form>
        </div>
    );
}
