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
    if (isPaused) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (!isActive) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = () => {
    if (isPaused) return 'Paused';
    if (!isActive) return 'Ended';
    return 'Active';
  };

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-2 mb-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/50 shadow-sm">
          <div className="text-lg md:text-xl font-bold text-slate-800">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-slate-500 font-medium">Hours</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/50 shadow-sm">
          <div className="text-lg md:text-xl font-bold text-slate-800">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-slate-500 font-medium">Minutes</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/50 shadow-sm">
          <div className="text-lg md:text-xl font-bold text-slate-800">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-slate-500 font-medium">Seconds</div>
        </div>
      </div>
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor()}`}>
        {getStatusText()}
      </div>
    </div>
  );
};