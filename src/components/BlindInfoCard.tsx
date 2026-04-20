import React from 'react';
import { Card } from './ui/card';
import { BlindLevel } from '../types';

interface BlindInfoCardProps {
  title: string;
  level: BlindLevel | null;
  isNext?: boolean;
}

export function BlindInfoCard({ title, level, isNext = false }: BlindInfoCardProps) {
  if (!level) return null;

  return (
    <Card className={`bg-white dark:bg-[#2A2A2A] rounded-[16px] p-[20px] shadow-[var(--card-shadow)] border border-black/5 dark:border-white/5 ${isNext ? 'opacity-60' : ''}`}>
      <div className="text-[11px] font-bold text-muted-foreground uppercase mb-[12px] tracking-[0.5px]">
        {title}
      </div>
      <div>
        {level.isBreak ? (
          <div className="text-[32px] font-[800] text-foreground leading-none">
            Break ({level.duration}m)
          </div>
        ) : (
          <>
            <div className={`text-[32px] font-[800] leading-none ${isNext ? 'text-foreground' : 'text-foreground'}`}>
              {level.blinds} / {level.bigBlind}
            </div>
            {level.ante > 0 && (
              <div className="text-[16px] font-[500] text-primary mt-[4px]">
                Ante {level.ante}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
