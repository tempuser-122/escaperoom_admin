import React, { useState } from 'react';
import type { Team, TeamStatus } from '../types';
import { Eye, Clock, Hash, Activity } from 'lucide-react';
import { LevelModal } from './LevelModal';

interface TeamListProps {
    teams: Team[];
    onUpdateStatus: (id: string, status: TeamStatus) => void;
    onDeductTime: (id: string) => void;
    onAddTime: (id: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ teams, onUpdateStatus, onDeductTime, onAddTime }) => {
    const [sortField, setSortField] = useState<keyof Team>('rank');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const handleSort = (field: keyof Team) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedTeams = [...teams].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue === bValue) return 0;

        // Handle array length comparison for levels (if someone sorts by it, though not directly key)

        if (aValue < bValue!) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue!) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const formatTime = (seconds: number) => {
        const m = Math.floor(Math.max(0, seconds) / 60);
        const s = Math.floor(Math.max(0, seconds) % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e0e6ed' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #1e3a8a', textAlign: 'left' }}>
                        <th className="th-sort" onClick={() => handleSort('rank')}><Hash size={14} /> RANK</th>
                        <th className="th-sort" onClick={() => handleSort('name')}>TEAM NAME</th>
                        <th className="th-sort" onClick={() => handleSort('currentLevel')}>LEVEL</th>
                        <th className="th-sort">STARTED AT</th>
                        <th className="th-sort">STATUS</th>
                        <th className="th-sort" onClick={() => handleSort('remainingTime')}><Clock size={14} /> TIME</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTeams.map(team => (
                        <tr key={team.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', height: '60px' }}>
                            <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{team.rank}</td>
                            <td style={{ fontWeight: 'bold', color: '#fff' }}>{team.name}</td>
                            <td>
                                <span style={{
                                    padding: '2px 8px',
                                    background: 'rgba(0,180,216,0.2)',
                                    border: '1px solid #00b4d8',
                                    borderRadius: '4px',
                                    color: '#00b4d8'
                                }}>
                                    Lvl {team.currentLevel}
                                </span>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#94a3b8' }}>
                                {team.levelStartTimes[team.currentLevel - 1]
                                    ? new Date(team.levelStartTimes[team.currentLevel - 1]!).toLocaleTimeString()
                                    : '-'}
                            </td>
                            <td className={`status-${team.status.toLowerCase().replace(' ', '-')}`}>
                                {team.status === 'Active' && <Activity size={14} style={{ marginRight: '5px' }} />}
                                {team.status}
                            </td>
                            <td style={{
                                fontFamily: 'monospace',
                                fontSize: '1.2rem',
                                color: team.remainingTime < 300 ? '#ff3333' : '#00ff41'
                            }}>
                                {formatTime(team.remainingTime)}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn btn-outline"
                                        title="View Level Status"
                                        onClick={() => setSelectedTeam(team)}
                                    >
                                        <Eye size={16} /> Status
                                    </button>
                                    {team.status === 'Active' ? (
                                        <button
                                            className="btn btn-outline"
                                            style={{ borderColor: '#ffd700', color: '#ffd700' }}
                                            onClick={() => onUpdateStatus(team.id, 'Paused')}
                                        >
                                            Pause
                                        </button>
                                    ) : team.status === 'Paused' ? (
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => onUpdateStatus(team.id, 'Active')}
                                        >
                                            Resume
                                        </button>
                                    ) : null}
                                    <button
                                        className="btn btn-outline"
                                        title="Increase Time (+5m)"
                                        style={{ borderColor: '#00ff41', color: '#00ff41' }}
                                        onClick={() => onAddTime(team.id)}
                                    >
                                        +5m
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        title="Manual Penalty (-5m)"
                                        style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}
                                        onClick={() => onDeductTime(team.id)}
                                    >
                                        -5m
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <LevelModal
                isOpen={!!selectedTeam}
                onClose={() => setSelectedTeam(null)}
                teamName={selectedTeam?.name || ''}
                levelsCompleted={selectedTeam?.levelsCompleted || []}
                levelStartTimes={selectedTeam?.levelStartTimes || []}
            />

            <style>{`
        th { padding: 1rem; cursor: pointer; color: #94a3b8; user-select: none; }
        th:hover { color: #fff; }
        td { padding: 1rem; }
      `}</style>
        </div>
    );
};
