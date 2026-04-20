import React from 'react';
import { Button } from './ui/button';
import { UserPlus, UserMinus, UserX } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onNextLevel: () => void;
  onPrevLevel: () => void;
  onOpenSettings: () => void;
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onSeatOpen: () => void;
}

export function ControlPanel({
  isRunning,
  onToggleTimer,
  onResetTimer,
  onNextLevel,
  onPrevLevel,
  onOpenSettings,
  onAddPlayer,
  onRemovePlayer,
  onSeatOpen,
}: ControlPanelProps) {
  return (
    <div className="h-[90px] bg-[#1A1A1A] flex items-center justify-between px-10 text-white shrink-0 overflow-x-auto gap-4">
      <div className="flex gap-3 shrink-0">
        <Button 
          className="h-[44px] px-5 rounded-lg border-none font-semibold text-[16px] w-[120px] bg-primary text-white hover:bg-primary/90"
          onClick={onToggleTimer}
        >
          {isRunning ? "PAUSE" : "START"}
        </Button>
        <Button 
          className="h-[44px] px-5 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20"
          onClick={onResetTimer}
        >
          Reset
        </Button>
      </div>

      <div className="flex gap-3 shrink-0">
        <Button 
          className="h-[44px] px-4 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          onClick={onSeatOpen}
          title="Seat Open (Removes from remaining)"
        >
          <UserX className="w-4 h-4" /> Seat Open
        </Button>
        <Button 
          className="h-[44px] px-4 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          onClick={onRemovePlayer}
          title="Remove Player (Removes from total)"
        >
          <UserMinus className="w-4 h-4" /> Player
        </Button>
        <Button 
          className="h-[44px] px-4 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          onClick={onAddPlayer}
          title="Add Player"
        >
          <UserPlus className="w-4 h-4" /> Player
        </Button>
        <Button 
          className="h-[44px] px-5 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20"
          onClick={onPrevLevel}
        >
          Prev Level
        </Button>
        <Button 
          className="h-[44px] px-5 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20"
          onClick={onNextLevel}
        >
          Next Level
        </Button>
        <Button 
          className="h-[44px] px-5 rounded-lg border-none font-semibold text-[13px] bg-white/10 text-white hover:bg-white/20"
          onClick={onOpenSettings}
        >
          Settings
        </Button>
      </div>
    </div>
  );
}
