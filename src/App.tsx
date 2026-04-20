import React, { useState, useEffect } from 'react';
import { useTournament } from './useTournament';
import { TimerDisplay } from './components/TimerDisplay';
import { BlindInfoCard } from './components/BlindInfoCard';
import { StatisticsCard } from './components/StatisticsCard';
import { StatusCard } from './components/StatusCard';
import { ControlPanel } from './components/ControlPanel';
import { SettingsModal } from './components/SettingsModal';
import { SeatOpenAnimation } from './components/SeatOpenAnimation';
import { Spade, Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const {
    state,
    levels,
    currentLevel,
    nextLevelData,
    toggleTimer,
    resetTimer,
    nextLevel,
    prevLevel,
    updateSettings,
    addPlayer,
    removePlayer,
    seatOpen,
    updateLevels,
    nextBreakTime,
  } = useTournament();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [seatOpenTrigger, setSeatOpenTrigger] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSeatOpen = () => {
    seatOpen();
    setSeatOpenTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleTimer();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextLevel();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevLevel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, nextLevel, prevLevel]);

  const prizePool = (state.settings.totalPlayers + state.settings.rebuys + state.settings.addons) * state.settings.buyIn;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden selection:bg-primary/30 transition-colors duration-300">
      <SeatOpenAnimation trigger={seatOpenTrigger} />
      
      {/* Header */}
      <header className="h-[80px] px-10 flex items-center justify-between border-b border-black/5 bg-white dark:bg-[#1A1A1A] dark:border-white/5 z-40 relative shrink-0">
        <div className="flex items-center">
          <div className="w-12 h-12 flex items-center justify-center mr-4 shrink-0">
            <img 
              src="/header-logo.png" 
              alt="Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-bold uppercase tracking-[0.5px] leading-tight">
              {state.settings.name}
            </h1>
            <p className="text-[12px] text-muted-foreground uppercase tracking-[1px] leading-tight">
              Tournament Blind Timer
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 px-4 lg:px-10 py-6 items-start overflow-y-auto">
        
        {/* Left Column: Blinds Info */}
        <div className="flex flex-col gap-5">
          <BlindInfoCard title="Current Blinds" level={currentLevel} />
          <BlindInfoCard title={`Next Level (${nextLevelData?.level || ''})`} level={nextLevelData} isNext />
          <StatusCard prizePool={prizePool} payoutSplit={state.settings.payoutSplit} />
        </div>

        {/* Center Column: Timer */}
        <div className="flex flex-col items-center justify-center h-full relative">
          <TimerDisplay 
            timeRemaining={state.timeRemaining} 
            currentLevel={currentLevel} 
            totalDuration={currentLevel.duration} 
            elapsedSeconds={state.elapsedSeconds}
            nextBreakTime={nextBreakTime}
          />
        </div>

        {/* Right Column: Stats & Status */}
        <div className="flex flex-col gap-5">
          <StatisticsCard settings={state.settings} />
        </div>

      </main>

      {/* Control Panel */}
      <ControlPanel 
        isRunning={state.isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onNextLevel={nextLevel}
        onPrevLevel={prevLevel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onSeatOpen={handleSeatOpen}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={state.settings}
        onSave={updateSettings}
        levels={levels}
        onSaveLevels={updateLevels}
      />
    </div>
  );
}
