"use client";

import {
	useState,
	type FormEvent,
	useEffect,
	useRef,
	useCallback,
} from "react";
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
	isHigherBetter?: boolean;
	initialScore?: string;
	prompt?: string;
}

interface AutoScoreSubmissionProps {
	testName: string;
	score: number;
	unit: string;
	isHigherBetter?: boolean;
	prompt?: string;
}

interface SubmitScoreResponse {
	success: boolean;
	percentageChange: number | null;
	previousScore: number | null;
	currentScore: number;
}

function useScoreSubmission({
	testName,
	unit,
	isHigherBetter = true,
	prompt,
}: Omit<ScoreInputProps, "scoreType" | "initialScore">) {
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

	const submitScore = async (score: number) => {
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

			const isImprovement =
				data.percentageChange !== null &&
				((isHigherBetter && data.percentageChange >= 0) ||
					(!isHigherBetter && data.percentageChange <= 0));

			if (data.success) {
				const aiPrompt = `Write a sentence (or more) to be displayed to a user who just completed a ${testName} test with a result of ${data.currentScore} ${unit}.

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
${prompt ? `The test prompt was: ${prompt} - this should take priority over making references to normal scores etc.` : ""}`;

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

	return { submitScore, isLoading, showAnimation, isHappy, completion };
}

export default function ScoreInput({
	testName,
	scoreType,
	unit,
	isHigherBetter = true,
	initialScore = "",
	prompt,
}: ScoreInputProps) {
	const [score, setScore] = useState(initialScore);
	const { submitScore, isLoading, showAnimation, isHappy, completion } =
		useScoreSubmission({ testName, unit, isHigherBetter, prompt });

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await submitScore(Number(score));
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
					<p>{completion}</p>
				</motion.div>
			)}
		</form>
	);
}

export function AutoScoreSubmission({
	testName,
	score,
	unit,
	isHigherBetter = true,
	prompt,
}: AutoScoreSubmissionProps) {
	const { submitScore, isLoading, showAnimation, isHappy, completion } =
		useScoreSubmission({ testName, unit, isHigherBetter, prompt });
	const hasSubmitted = useRef(false);

	const submitScoreOnce = useCallback(() => {
		if (!hasSubmitted.current) {
			submitScore(score);
			hasSubmitted.current = true;
		}
	}, [submitScore, score]);

	useEffect(() => {
		submitScoreOnce();
	}, [submitScoreOnce]);

	return (
		<>
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
					<p>{completion}</p>
				</motion.div>
			)}
		</>
	);
}
