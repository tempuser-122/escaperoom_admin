export type TeamStatus = 'Active' | 'Paused' | 'Completed' | 'Timed Out';

export interface Team {
  id: string;
  name: string;
  currentLevel: number;
  // Index 0 = Level 1, etc. true = completed
  levelsCompleted: boolean[];
  // Timestamp string for when they started level 1, 2, 3, 4, 5. 
  levelStartTimes: (string | null)[];
  status: TeamStatus;
  remainingTime: number; // in seconds
  rank: number;
  hintsUsed: number;
}

export interface Level {
  id: number;
  name: string;
}

export const LEVELS_COUNT = 5;
export const TOTAL_GAME_TIME_SECONDS = 50 * 60; // 50 minutes
