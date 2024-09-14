"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ScoreInputProps {
  testName: string;
  scoreType: "number" | "text";
  unit: string;
}

export default function ScoreInput({
  testName,
  scoreType,
  unit,
}: ScoreInputProps) {
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");
  const [isHappy, setIsHappy] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testName, score: Number(score) }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setIsHappy(data.scoreDifference === null || data.scoreDifference >= 0);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000); // Hide animation after 3 seconds
      } else {
        setMessage("Failed to submit score. Please try again.");
        setIsHappy(false);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      setMessage("An error occurred. Please try again.");
      setIsHappy(false);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="score">Your Score ({unit})</Label>
        <Input
          id="score"
          type={scoreType}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Submit Score</Button>

      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mt-4 p-4 rounded-md ${
            isHappy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <p>{message}</p>
          {isHappy ? (
            <span className="text-4xl">🎉</span>
          ) : (
            <span className="text-4xl">😢</span>
          )}
        </motion.div>
      )}
    </form>
  );
}
