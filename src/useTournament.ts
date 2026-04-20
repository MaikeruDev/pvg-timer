import { useState, useEffect, useCallback, useRef } from 'react';
import { BlindLevel, TournamentState, TournamentSettings } from './types';

export const defaultLevels: BlindLevel[] = [
  { level: 1, blinds: 25, bigBlind: 50, ante: 0, duration: 20, isBreak: false },
  { level: 2, blinds: 50, bigBlind: 100, ante: 0, duration: 20, isBreak: false },
  { level: 3, blinds: 75, bigBlind: 150, ante: 0, duration: 20, isBreak: false },
  { level: 4, blinds: 100, bigBlind: 200, ante: 0, duration: 20, isBreak: false },
  { level: 0, blinds: 0, bigBlind: 0, ante: 0, duration: 15, isBreak: true }, // Break
  { level: 5, blinds: 150, bigBlind: 300, ante: 25, duration: 20, isBreak: false },
  { level: 6, blinds: 200, bigBlind: 400, ante: 50, duration: 20, isBreak: false },
  { level: 7, blinds: 300, bigBlind: 600, ante: 75, duration: 20, isBreak: false },
  { level: 8, blinds: 400, bigBlind: 800, ante: 100, duration: 20, isBreak: false },
  { level: 0, blinds: 0, bigBlind: 0, ante: 0, duration: 15, isBreak: true }, // Break
  { level: 9, blinds: 500, bigBlind: 1000, ante: 100, duration: 20, isBreak: false },
  { level: 10, blinds: 600, bigBlind: 1200, ante: 200, duration: 20, isBreak: false },
  { level: 11, blinds: 800, bigBlind: 1600, ante: 200, duration: 20, isBreak: false },
  { level: 12, blinds: 1000, bigBlind: 2000, ante: 300, duration: 20, isBreak: false },
];

export const defaultSettings: TournamentSettings = {
  name: "Pokerverein Gaissau",
  startingStack: 10000,
  totalPlayers: 36,
  playersRemaining: 36,
  rebuys: 0,
  addons: 0,
  buyIn: 50,
  payoutSplit: [50, 30, 20],
};

const getInitialLevels = (): BlindLevel[] => {
  try {
    const saved = localStorage.getItem('poker_levels');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load levels from cache", e);
  }
  return defaultLevels;
};

const getInitialSettings = (): TournamentSettings => {
  try {
    const saved = localStorage.getItem('poker_settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load settings from cache", e);
  }
  return defaultSettings;
};

export function useTournament() {
  const [levels, setLevels] = useState<BlindLevel[]>(getInitialLevels);
  const [state, setState] = useState<TournamentState>(() => {
    const initialLevels = getInitialLevels();
    const initialSettings = getInitialSettings();
    return {
      currentLevelIndex: 0,
      timeRemaining: initialLevels[0]?.duration * 60 || 0,
      elapsedSeconds: 0,
      isRunning: false,
      settings: initialSettings,
    };
  });

  useEffect(() => {
    localStorage.setItem('poker_levels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('poker_settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'warning' | 'levelup' | 'seatopen') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const playTone = (freq: number, startTime: number, duration: number, vol = 0.5) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(vol, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      if (type === 'warning') {
        // 1 minute warning: two short beeps
        playTone(880, now, 0.15);
        playTone(880, now + 0.25, 0.15);
      } else if (type === 'levelup') {
        // Level up: three ascending beeps
        playTone(440, now, 0.2);
        playTone(554, now + 0.2, 0.2);
        playTone(659, now + 0.4, 0.4);
      } else if (type === 'seatopen') {
        // Seat open: dramatic descending sound or coin-like pings
        // Let's do a sequence of high-pitched "coin" pings
        playTone(1200, now, 0.1, 0.3);
        playTone(1600, now + 0.1, 0.2, 0.3);
        
        playTone(1200, now + 0.3, 0.1, 0.3);
        playTone(1600, now + 0.4, 0.2, 0.3);
        
        playTone(1200, now + 0.6, 0.1, 0.3);
        playTone(1600, now + 0.7, 0.4, 0.3);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRunning) {
      interval = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining > 0) {
            const nextTime = prev.timeRemaining - 1;
            if (nextTime === 60) {
              setTimeout(() => playSound('warning'), 0);
            } else if (nextTime === 0) {
              setTimeout(() => playSound('levelup'), 0);
            }
            return {
              ...prev,
              timeRemaining: nextTime,
              elapsedSeconds: prev.elapsedSeconds + 1,
            };
          } else {
            // Auto advance level
            if (prev.currentLevelIndex < levels.length - 1) {
              const nextIndex = prev.currentLevelIndex + 1;
              return {
                ...prev,
                currentLevelIndex: nextIndex,
                timeRemaining: levels[nextIndex].duration * 60,
                elapsedSeconds: prev.elapsedSeconds + 1,
              };
            } else {
              return { ...prev, isRunning: false };
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning, levels, playSound]);

  const toggleTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeRemaining: levels[prev.currentLevelIndex].duration * 60,
      isRunning: false,
    }));
  }, [levels]);

  const nextLevel = useCallback(() => {
    setState((prev) => {
      if (prev.currentLevelIndex < levels.length - 1) {
        setTimeout(() => playSound('levelup'), 0);
        const nextIndex = prev.currentLevelIndex + 1;
        return {
          ...prev,
          currentLevelIndex: nextIndex,
          timeRemaining: levels[nextIndex].duration * 60,
        };
      }
      return prev;
    });
  }, [levels, playSound]);

  const prevLevel = useCallback(() => {
    setState((prev) => {
      if (prev.currentLevelIndex > 0) {
        const prevIndex = prev.currentLevelIndex - 1;
        return {
          ...prev,
          currentLevelIndex: prevIndex,
          timeRemaining: levels[prevIndex].duration * 60,
        };
      }
      return prev;
    });
  }, [levels]);

  const updateSettings = useCallback((newSettings: Partial<TournamentSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const addPlayer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        totalPlayers: prev.settings.totalPlayers + 1,
        playersRemaining: prev.settings.playersRemaining + 1,
      }
    }));
  }, []);

  const removePlayer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        totalPlayers: Math.max(0, prev.settings.totalPlayers - 1),
        playersRemaining: Math.max(0, prev.settings.playersRemaining - 1),
      }
    }));
  }, []);

  const seatOpen = useCallback(() => {
    playSound('seatopen');
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        playersRemaining: Math.max(0, prev.settings.playersRemaining - 1),
      }
    }));
  }, [playSound]);

  const updateLevels = useCallback((newLevels: BlindLevel[]) => {
    setState(prev => {
      if (prev.currentLevelIndex >= newLevels.length) {
        return {
          ...prev,
          currentLevelIndex: 0,
          timeRemaining: (newLevels[0]?.duration || 0) * 60
        };
      }
      
      const oldDuration = levels[prev.currentLevelIndex]?.duration;
      const newDuration = newLevels[prev.currentLevelIndex]?.duration;
      
      if (oldDuration !== newDuration) {
        return {
          ...prev,
          timeRemaining: (newDuration || 0) * 60
        };
      }
      
      return prev;
    });
    setLevels(newLevels);
  }, [levels]);

  const getNextBreakTime = useCallback(() => {
    if (levels[state.currentLevelIndex]?.isBreak) return 0;
    let accumulated = state.timeRemaining;
    for (let i = state.currentLevelIndex + 1; i < levels.length; i++) {
      if (levels[i].isBreak) {
        return accumulated;
      }
      accumulated += levels[i].duration * 60;
    }
    return null;
  }, [levels, state.currentLevelIndex, state.timeRemaining]);

  return {
    state,
    levels,
    currentLevel: levels[state.currentLevelIndex],
    nextLevelData: state.currentLevelIndex < levels.length - 1 ? levels[state.currentLevelIndex + 1] : null,
    toggleTimer,
    resetTimer,
    nextLevel,
    prevLevel,
    updateSettings,
    addPlayer,
    removePlayer,
    seatOpen,
    updateLevels,
    nextBreakTime: getNextBreakTime(),
  };
}
