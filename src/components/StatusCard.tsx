import React from 'react';
import { Card } from './ui/card';

interface StatusCardProps {
  prizePool: number;
  payoutSplit: number[];
}

export function StatusCard({ prizePool, payoutSplit }: StatusCardProps) {
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const payouts = payoutSplit.map((percentage, index) => ({
    place: getOrdinal(index + 1),
    amount: prizePool * (percentage / 100),
  }));

  return (
    <Card className="bg-white dark:bg-[#2A2A2A] rounded-[16px] p-[20px] shadow-[var(--card-shadow)] border border-black/5 dark:border-white/5">
      <div className="text-[11px] font-bold text-muted-foreground uppercase mb-[12px] tracking-[0.5px]">
        Payouts
      </div>
      <ul className="list-none m-0 p-0">
        {payouts.map((payout, index) => (
          <li key={index} className="flex justify-between py-[6px] text-[13px]">
            <span className="font-bold text-primary w-[30px]">{payout.place}</span>
            <span className="font-semibold">€{payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
