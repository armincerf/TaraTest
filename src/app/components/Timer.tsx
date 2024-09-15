import React from 'react';

interface TimerProps {
  timeRemaining: number;
}

export default function Timer({ timeRemaining }: TimerProps) {
  return (
    <div className="text-2xl font-bold text-purple-800">
      Time: {timeRemaining}s
    </div>
  );
}
