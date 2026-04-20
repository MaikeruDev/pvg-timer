export interface BlindLevel {
  level: number;
  blinds: number;
  bigBlind: number;
  ante: number;
  duration: number; // in minutes
  isBreak: boolean;
}

export interface TournamentSettings {
  name: string;
  startingStack: number;
  totalPlayers: number;
  playersRemaining: number;
  rebuys: number;
  addons: number;
  buyIn: number;
  payoutSplit: number[];
}

export interface TournamentState {
  currentLevelIndex: number;
  timeRemaining: number; // in seconds
  elapsedSeconds: number;
  isRunning: boolean;
  settings: TournamentSettings;
}
