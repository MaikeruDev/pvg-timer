import React from 'react';
import { Card } from './ui/card';
import { TournamentSettings } from '../types';

interface StatisticsCardProps {
  settings: TournamentSettings;
}

export function StatisticsCard({ settings }: StatisticsCardProps) {
  const totalChips = settings.totalPlayers * settings.startingStack + settings.rebuys * settings.startingStack + settings.addons * settings.startingStack;
  const averageStack = settings.playersRemaining > 0 ? Math.floor(totalChips / settings.playersRemaining) : 0;
  const prizePool = (settings.totalPlayers + settings.rebuys + settings.addons) * settings.buyIn;

  return (
    <div className="flex flex-col gap-5">
      <Card className="bg-white dark:bg-[#2A2A2A] rounded-[16px] p-[20px] shadow-[var(--card-shadow)] border border-black/5 dark:border-white/5">
        <div className="text-[11px] font-bold text-muted-foreground uppercase mb-[12px] tracking-[0.5px]">
          Tournament Stats
        </div>
        <div className="flex flex-col">
          <StatRow label="Players Left" value={`${settings.playersRemaining} / ${settings.totalPlayers}`} />
          <StatRow label="Avg. Stack" value={averageStack.toLocaleString()} />
          <StatRow label="Total Chips" value={totalChips.toLocaleString()} />
          <StatRow label="Prize Pool" value={`€${prizePool.toLocaleString()}`} />
        </div>
      </Card>
      <Card className="bg-white dark:bg-[#2A2A2A] rounded-[16px] p-[20px] shadow-[var(--card-shadow)] border border-black/5 dark:border-white/5">
        <div className="text-[11px] font-bold text-muted-foreground uppercase mb-[12px] tracking-[0.5px]">
          Tournament Settings
        </div>
        <div className="flex flex-col">
          <StatRow label="Start Stack" value={settings.startingStack.toLocaleString()} />
          <StatRow label="Rebuys" value={settings.rebuys.toLocaleString()} />
          <StatRow label="Add-ons" value={settings.addons.toLocaleString()} />
        </div>
      </Card>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-[8px] border-b border-[#F0F0F0] dark:border-[#333333] last:border-b-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-semibold">{value}</span>
    </div>
  );
}
