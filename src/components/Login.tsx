import React, { useState } from 'react';
import { Shield, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'shadow' && password === 'admin') {
            // Mock authentication
            localStorage.setItem('auth', 'true');
            navigate('/dashboard');
        } else {
            setError('Access Denied: Invalid Credentials');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at center, #102a43 0%, #000 100%)'
        }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Shield size={64} color="#00ff41" />
                    <h1 className="neon-text" style={{ fontSize: '2rem', marginTop: '1rem' }}>THE SHADOW</h1>
                    <p style={{ color: '#94a3b8' }}>Admin Access Terminal</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '10px', top: '10px', color: '#00ff41' }}>
                            <UserIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Ident"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid #1e3a8a',
                                color: '#fff',
                                fontFamily: 'monospace',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '10px', top: '10px', color: '#00ff41' }}>
                            <Key size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="Passcode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid #1e3a8a',
                                color: '#fff',
                                fontFamily: 'monospace',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {error && <div style={{ color: '#ff3333', marginBottom: '1rem', border: '1px solid #ff3333', padding: '5px' }}>{error}</div>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Lock size={18} /> AUTHENTICATE
                    </button>
                </form>
            </div>
        </div>
    );
};

// Helper icon since we missed imports or simple SVG
const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
