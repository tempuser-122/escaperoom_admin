import React from 'react';
import { X, CheckCircle, Circle } from 'lucide-react';
import { LEVELS_COUNT, type TeamStatus } from '../types';

interface LevelModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamName: string;
    levelsCompleted: boolean[];
    levelStartTimes: (string | null)[];
    status?: TeamStatus;
}

export const LevelModal: React.FC<LevelModalProps> = ({ isOpen, onClose, teamName, levelsCompleted, levelStartTimes, status }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{ width: '500px', padding: '2rem', transform: 'scale(1)', transition: 'transform 0.3s' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="neon-text" style={{ margin: 0 }}>LEVEL STATUS: {teamName}</h2>
                    <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem' }}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    {Array.from({ length: LEVELS_COUNT }).map((_, index) => {
                        const isCompleted = levelsCompleted[index] || status === 'Completed';

                        return (
                            <div key={index} style={{
                                flex: 1,
                                height: '80px',
                                background: isCompleted ? 'rgba(0, 255, 65, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${isCompleted ? '#00ff41' : '#333'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                transition: 'all 0.5s',
                                boxShadow: isCompleted ? '0 0 15px rgba(0,255,65,0.3)' : 'none'
                            }}>
                                <div style={{ fontWeight: 'bold', color: isCompleted ? '#00ff41' : '#555', marginBottom: '5px' }}>LVL {index + 1}</div>
                                {isCompleted ? <CheckCircle color="#00ff41" size={24} /> : <Circle color="#555" size={24} />}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <div style={{ fontWeight: 'bold', color: '#fff', borderBottom: '1px solid #333' }}>TIMESTAMPS</div>
                    {Array.from({ length: LEVELS_COUNT }).map((_, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #222', padding: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#fff' }}>Level {index + 1}:</span>
                            <span>{levelStartTimes[index] ? new Date(levelStartTimes[index]!).toLocaleTimeString() : '-'}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    STATUS: {levelsCompleted.filter(Boolean).length} / {LEVELS_COUNT} UPLINKS ESTABLISHED
                </div>
            </div>
        </div>
    );
};
