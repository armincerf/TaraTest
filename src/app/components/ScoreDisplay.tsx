interface ScoreDisplayProps {
  correct: number;
  incorrect: number;
}

export default function ScoreDisplay({ correct, incorrect }: ScoreDisplayProps) {
  return (
    <div className="text-xl font-bold text-purple-800">
      Score: {correct} / {correct + incorrect}
    </div>
  );
}
