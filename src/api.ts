import type { Team } from './types';
import { TOTAL_GAME_TIME_SECONDS, LEVELS_COUNT } from './types';

// Mock Data
const INITIAL_TEAMS: Team[] = [
    {
        id: 't1',
        name: 'Cipher Solvers',
        currentLevel: 1,
        levelsCompleted: [false, false, false, false, false],
        levelStartTimes: [new Date().toISOString(), null, null, null, null],
        status: 'Active',
        remainingTime: TOTAL_GAME_TIME_SECONDS,
        rank: 1,
        hintsUsed: 0
    },
    {
        id: 't2',
        name: 'Binary Bandits',
        currentLevel: 2,
        levelsCompleted: [true, false, false, false, false],
        levelStartTimes: [new Date(Date.now() - 1000 * 60 * 10).toISOString(), new Date().toISOString(), null, null, null],
        status: 'Active',
        remainingTime: TOTAL_GAME_TIME_SECONDS - 600,
        rank: 2,
        hintsUsed: 1
    },
    {
        id: 't3',
        name: 'Hack The Planet',
        currentLevel: 3,
        levelsCompleted: [true, true, false, false, false],
        levelStartTimes: [
            new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            new Date().toISOString(),
            null, null
        ],
        status: 'Active',
        remainingTime: TOTAL_GAME_TIME_SECONDS - 1200,
        rank: 3,
        hintsUsed: 2
    },
    {
        id: 't4',
        name: 'Zero Day Squad',
        currentLevel: 1,
        levelsCompleted: [false, false, false, false, false],
        levelStartTimes: [new Date().toISOString(), null, null, null, null],
        status: 'Paused',
        remainingTime: 3000,
        rank: 4,
        hintsUsed: 0
    },
    {
        id: 't5',
        name: 'Firewall Breakers',
        currentLevel: 5,
        levelsCompleted: [true, true, true, true, false],
        levelStartTimes: Array(5).fill(new Date().toISOString()),
        status: 'Completed',
        remainingTime: 500,
        rank: 5,
        hintsUsed: 0
    }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (could be localStorage)
let teams = [...INITIAL_TEAMS];

export async function fetchTeams(): Promise<Team[]> {
    await delay(500);
    const sortedTeams = [...teams].sort((a, b) => {
        const aLevels = a.levelsCompleted.filter(Boolean).length;
        const bLevels = b.levelsCompleted.filter(Boolean).length;
        if (aLevels !== bLevels) return bLevels - aLevels;
        return b.remainingTime - a.remainingTime;
    });

    return sortedTeams.map((team, index) => ({
        ...team,
        rank: index + 1
    }));
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<void> {
    await delay(200);
    teams = teams.map(t => t.id === id ? { ...t, ...updates } : t);
}

export async function resetLevel(teamId: string, levelIndex: number): Promise<void> {
    await delay(200);
    teams = teams.map(t => {
        if (t.id === teamId) {
            const newLevels = [...t.levelsCompleted];
            if (levelIndex >= 0 && levelIndex < LEVELS_COUNT) {
                newLevels[levelIndex] = false;
            }
            return { ...t, levelsCompleted: newLevels };
        }
        return t;
    });
}

export async function deductTime(teamId: string, seconds: number): Promise<void> {
    await delay(100);
    teams = teams.map(t => {
        if (t.id === teamId) {
            const newTime = Math.max(0, t.remainingTime - seconds);
            return { ...t, remainingTime: newTime, hintsUsed: t.hintsUsed + 1 };
        }
        return t;
    });
}

export async function addTime(teamId: string, seconds: number): Promise<void> {
    await delay(100);
    teams = teams.map(t => {
        if (t.id === teamId) {
            const newTime = t.remainingTime + seconds;
            return { ...t, remainingTime: newTime };
        }
        return t;
    });
}
