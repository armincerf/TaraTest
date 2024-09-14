"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useScore } from "../contexts/ScoreContext";
import { useCompletion } from "ai/react";

interface ScoreInputProps {
  testName: string;
  scoreType: "number" | "text";
  unit: string;
  isHigherBetter?: boolean; // New property to specify if higher is better
  initialScore?: string;
  prompt?: string;
}

interface SubmitScoreResponse {
  success: boolean;
  percentageChange: number | null;
  previousScore: number | null;
  currentScore: number;
}

export default function ScoreInput({
  testName,
  scoreType,
  unit,
  isHigherBetter = true, // Destructure the new prop
  initialScore = "",
  prompt,
}: ScoreInputProps) {
  const [score, setScore] = useState(initialScore);
  const [isHappy, setIsHappy] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();
  const { updateScoreStatus } = useScore();

  const {
    completion,
    complete: generateAIResponse,
    isLoading,
  } = useCompletion({
    api: "/api/completion",
  });

  useEffect(() => {
    if (completion) {
      setShowAnimation(true);
    }
  }, [completion]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          score: Number(score),
        }),
      });

      const data: SubmitScoreResponse = await response.json();

      // Adjust logic based on isHigherBetter
      const isImprovement =
        data.percentageChange !== null &&
        ((isHigherBetter && data.percentageChange >= 0) ||
          (!isHigherBetter && data.percentageChange <= 0));

      const isWorse =
        data.percentageChange !== null &&
        ((isHigherBetter && data.percentageChange < 0) ||
          (!isHigherBetter && data.percentageChange > 0));

      if (data.success) {
        const aiPrompt = `Write a sentence to be displayed to a user who just completed a ${testName} test with a result of ${data.currentScore} ${unit}.

          If the unit is percentage based a decimal will be provided so 0.5 means 50%, ignore units in this case.
Make references to the average scores normal people get on these sorts of tests, but don't invent statistics and don't be too positive if it's a bad score.
We are comparing these results to that of an experienced UI/UX designer (except for typing speed which is just compared to the average technical user, the target for the user to hit on typing is 45wpm or more, the average person does 40wpm).
${
  data.percentageChange !== null
    ? `The user's score ${
        isImprovement ? "improved" : "decreased"
      } by ${Math.abs(data.percentageChange)}% from their previous score of ${
        data.previousScore
      } ${unit}.`
    : ""
}
${prompt ? `The test prompt was: ${prompt}` : ""}`;

        generateAIResponse(aiPrompt);

        setIsHappy(isImprovement || data.percentageChange === null);

        updateScoreStatus(testName, true);
        router.refresh();
      } else {
        setShowAnimation(true);
        setIsHappy(false);
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      setShowAnimation(true);
      setIsHappy(false);
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
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating response..." : "Submit Score"}
      </Button>

      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mt-4 p-4 rounded-md ${
            isHappy
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          <p>
            {completion}
          </p>
        </motion.div>
      )}
    </form>
  );
}
