// src/app/components/ScoreIndicator.tsx
"use client";

import { useScore } from '../contexts/ScoreContext';

export default function ScoreIndicator({ testId }: { testId: string }) {
  const { scoreStatus } = useScore();

  if (scoreStatus[testId]) {
    return <span>✅</span>;
  }

  return null;
}
