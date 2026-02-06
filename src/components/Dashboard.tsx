import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams, updateTeam, deductTime, addTime } from '../api';
import type { Team, TeamStatus } from '../types';
import { TeamList } from './TeamList';
import { LogOut, ShieldAlert, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const prevTeamsRef = useRef<Team[]>([]);

    useEffect(() => {
        const isAuth = localStorage.getItem('auth');
        if (!isAuth) {
            navigate('/');
        }
    }, [navigate]);

    const loadData = async () => {
        try {
            const data = await fetchTeams();

            // Check for changes (Simple Alert Logic)
            data.forEach(newTeam => {
                const oldTeam = prevTeamsRef.current.find(t => t.id === newTeam.id);
                if (oldTeam) {
                    if (newTeam.currentLevel > oldTeam.currentLevel) {
                        // Ideally show a toast
                        console.log(`Team ${newTeam.name} advanced to Level ${newTeam.currentLevel}!`);
                    }
                    if (newTeam.hintsUsed > oldTeam.hintsUsed) {
                        console.log(`Team ${newTeam.name} used a hint!`);
                    }
                }
            });

            prevTeamsRef.current = data;
            setTeams(data);
            setLastUpdated(new Date());
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch teams", error);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id: string, status: TeamStatus) => {
        await updateTeam(id, { status });
        loadData(); // Immediate refresh
    };

    const handleDeductTime = async (id: string) => {
        if (window.confirm("Deduct 5 minutes from this team?")) {
            await deductTime(id, 300); // 5 mins
            loadData();
        }
    };

    const handleAddTime = async (id: string) => {
        if (window.confirm("Add 5 minutes to this team?")) {
            await addTime(id, 300); // 5 mins
            loadData();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        navigate('/');
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid #1e3a8a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ShieldAlert size={32} color="#00ff41" />
                    <div>
                        <h1 className="neon-text" style={{ margin: 0, fontSize: '1.5rem' }}>SHADOW PROTOCOL</h1>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ADMINISTRATOR ACCESS GRANTED</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#94a3b8' }}>
                        <div>STATUS: ONLINE</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            SYNC: {lastUpdated.toLocaleTimeString()}
                            <RefreshCw size={12} className={loading ? "spin" : ""} />
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <LogOut size={16} /> ABORT
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px 10px 0' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        const headers = ['ID', 'Name', 'Current Level', 'Status', 'Remaining Time', 'Rank', 'Hints Used'].join(',');
                        const rows = teams.map(t => [
                            t.id,
                            t.name,
                            t.currentLevel,
                            t.status,
                            t.remainingTime,
                            t.rank,
                            t.hintsUsed
                        ].join(','));
                        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "escape_room_teams.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                >
                    EXPORT DATA
                </button>
            </div>

            <main>
                {loading && teams.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>INITIALIZING UPLINK...</div>
                ) : (
                    <TeamList
                        teams={teams}
                        onUpdateStatus={handleStatusUpdate}
                        onDeductTime={handleDeductTime}
                        onAddTime={handleAddTime}
                    />
                )}
            </main>

            <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
        </div>
    );
};
