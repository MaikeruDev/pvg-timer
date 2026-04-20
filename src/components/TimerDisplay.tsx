import React from 'react';
import { motion } from 'motion/react';
import { BlindLevel } from '../types';

interface TimerDisplayProps {
  timeRemaining: number;
  currentLevel: BlindLevel;
  totalDuration: number;
  elapsedSeconds: number;
  nextBreakTime: number | null;
}

export function TimerDisplay({ timeRemaining, currentLevel, totalDuration, elapsedSeconds, nextBreakTime }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration * 60 - timeRemaining) / (totalDuration * 60)) * 100;
  const isLowTime = timeRemaining <= 60 && timeRemaining > 0; // Less than 1 minute

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="relative w-[340px] h-[340px] flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 340 340">
          <circle
            cx="170"
            cy="170"
            r="160"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-[#EEEEEE] dark:text-[#333333]"
          />
          <motion.circle
            cx="170"
            cy="170"
            r="160"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={isLowTime ? "text-destructive" : "text-primary"}
            initial={{ strokeDasharray: "0 1005" }}
            animate={{ strokeDasharray: `${(progress / 100) * 1005} 1005` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="z-10 flex flex-col items-center">
          <div className="text-[16px] font-[600] uppercase tracking-[2px] text-primary mb-[8px]">
            {currentLevel.isBreak ? 'Break' : `Level ${currentLevel.level}`}
          </div>
          
          <motion.div 
            className={`font-mono text-[84px] font-[700] leading-none ${isLowTime ? 'text-destructive animate-pulse' : 'text-foreground'}`}
            animate={isLowTime ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {formatTime(timeRemaining)}
          </motion.div>
        </div>
      </div>

      <div className="flex gap-[24px] mt-[24px]">
        <div className="text-center">
          <div className="text-[14px] font-[700]">{currentLevel.duration}:00</div>
          <div className="text-[10px] uppercase text-muted-foreground">Level Time</div>
        </div>
        <div className="text-center">
          <div className="text-[14px] font-[700]">{formatTotalTime(elapsedSeconds)}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Total Time</div>
        </div>
        <div className="text-center">
          <div className="text-[14px] font-[700]">{nextBreakTime !== null ? formatTotalTime(nextBreakTime) : '--:--:--'}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Next Break</div>
        </div>
      </div>
    </div>
  );
}
