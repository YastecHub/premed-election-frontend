import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  isActive: boolean;
  isPaused: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  isActive,
  isPaused
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getStatusColor = () => {
    if (isPaused) return 'text-amber-400 bg-amber-500/15 border-amber-500/25';
    if (!isActive) return 'text-red-400 bg-red-500/15 border-red-500/25';
    return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25';
  };

  const getStatusText = () => {
    if (isPaused) return 'Paused';
    if (!isActive) return 'Ended';
    return 'Active';
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-3">
        <div className="bg-zinc-800/80 rounded-xl px-3 py-2 border border-zinc-700/50 min-w-[56px]">
          <div className="text-lg md:text-xl font-bold text-zinc-100 tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Hours</div>
        </div>
        <div className="bg-zinc-800/80 rounded-xl px-3 py-2 border border-zinc-700/50 min-w-[56px]">
          <div className="text-lg md:text-xl font-bold text-zinc-100 tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Minutes</div>
        </div>
        <div className="bg-zinc-800/80 rounded-xl px-3 py-2 border border-zinc-700/50 min-w-[56px]">
          <div className="text-lg md:text-xl font-bold text-zinc-100 tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Seconds</div>
        </div>
      </div>
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor()}`}>
        {getStatusText()}
      </div>
    </div>
  );
};
