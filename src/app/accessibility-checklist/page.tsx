"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
	generateColorPairWithContrast,
	getContrastRatio,
	isColorContrastGood,
} from "../utils/colourContrastCheck";
import { generateRandomHexColor } from "../utils/generateColourPalletes";
import { AutoScoreSubmission } from "../components/ScoreInput";

interface Question {
	scenario: string;
	isGood: boolean;
	explanation: string;
	component: React.ReactNode;
}

function ColorContrastExample({
	bgColor,
	textColor,
}: { bgColor: string; textColor: string }) {
	return (
		<div className="relative p-4 rounded" style={{ backgroundColor: bgColor }}>
			<p style={{ color: textColor }}>Sample Text</p>
		</div>
	);
}

const generateColorContrastQuestions = (): Question[] => {
	return Array(7)
		.fill(null)
		.map(() => {
			const { bgColor, textColor } = generateColorPairWithContrast(
				Math.random() < 0.5,
			);
			const isGood = isColorContrastGood(bgColor, textColor);
			return {
				scenario: "Text and background colors are chosen as follows:",
				explanation: `This color combination provides ${isGood ? "good" : "poor"} contrast, making the text ${isGood ? "easily readable" : "difficult to read"} for ${isGood ? "most users" : "many users, especially those with visual impairments"}.`,
				component: (
					<ColorContrastExample bgColor={bgColor} textColor={textColor} />
				),
				isGood,
			};
		});
};

const hardcodedQuestions: Question[] = [
	{
		scenario: "A form uses this approach for input fields:",
		isGood: false,
		explanation:
			"This approach can cause confusion and accessibility issues, especially when users start interacting with the form.",
		component: (
			<div className="space-y-4">
				<Input placeholder="Enter your name" />
				<Input placeholder="Enter your email" />
			</div>
		),
	},
	{
		scenario: "A dashboard uses this method to indicate different states:",
		isGood: true,
		explanation:
			"This method ensures that information is accessible to all users, including those with visual impairments.",
		component: (
			<div className="flex space-x-4">
				<div className="flex items-center space-x-2 text-green-500">
					<CheckCircle2 />
					<span>Active</span>
				</div>
				<div className="flex items-center space-x-2 text-red-500">
					<AlertCircle />
					<span>Inactive</span>
				</div>
			</div>
		),
	},
	{
		scenario: "A website implements navigation in this manner:",
		isGood: false,
		explanation:
			"This implementation may exclude certain user groups and limit accessibility options.",
		component: (
			<div className="space-y-2">
				<Button>Click me (but you can't focus with keyboard)</Button>
				<p className="text-sm text-gray-500">
					Try tabbing to the button - it won't work in this example.
				</p>
			</div>
		),
	},
];

export default function UIUXAccessibilityTest() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [showExplanation, setShowExplanation] = useState(false);
	const [isTestComplete, setIsTestComplete] = useState(false);
	const [feedbackText, setFeedbackText] = useState("");

	useEffect(() => {
		const allQuestions = [
			...generateColorContrastQuestions(),
			...hardcodedQuestions,
		];
		setQuestions(allQuestions.sort(() => 0.5 - Math.random()));
	}, []);

	const handleAnswer = (answer: boolean) => {
		const currentQuestion = questions[currentQuestionIndex];
		if (answer === currentQuestion.isGood) {
			setScore(score + 1);
			setFeedbackText(`Correct! ${currentQuestion.explanation}`);
		} else {
			setFeedbackText(`Incorrect. ${currentQuestion.explanation}`);
		}
		setShowExplanation(true);
	};

	const nextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setShowExplanation(false);
			setFeedbackText("");
		} else {
			setIsTestComplete(true);
		}
	};

	const restartTest = () => {
		const newQuestions = [
			...generateColorContrastQuestions(),
			...hardcodedQuestions,
		].sort(() => 0.5 - Math.random());
		setQuestions(newQuestions);
		setCurrentQuestionIndex(0);
		setScore(0);
		setShowExplanation(false);
		setIsTestComplete(false);
		setFeedbackText("");
	};

	if (questions.length === 0) return <div>Loading...</div>;

	if (isTestComplete) {
		return (
			<Card className="max-w-2xl mx-auto mt-10 bg-gradient-to-r from-purple-400 to-pink-500 text-white">
				<CardContent className="p-6">
					<h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
					<p className="text-2xl mb-4">Your score: {score} out of 10</p>
					<p className="mb-6 text-lg">
						{score === 10
							? "Perfect score! You're an accessibility expert!"
							: score >= 8
								? "Great job! You have a strong grasp of accessibility principles."
								: score >= 6
									? "Good effort! There's room for improvement in your accessibility knowledge."
									: "You might want to review accessibility guidelines. Keep learning!"}
					</p>
					<AutoScoreSubmission
						testName="Accessibility Checklist (% correct)"
						score={score / 10}
						unit="(1 is 100% correct, 0.5 is 50% etc. read the answer as a percentage)"
						isHigherBetter={true}
						prompt="Tara completed a UI/UX Accessibility test with 10 questions about good and bad accessibility practices."
					/>
					<Button
						onClick={restartTest}
						className="w-full bg-white text-purple-600 hover:bg-gray-100 mt-4"
					>
						Take the Test Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 space-y-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
			<h1 className="text-4xl font-bold mb-6 text-center text-purple-800">
				UI/UX Accessibility Challenge
			</h1>
			<Progress
				value={(currentQuestionIndex / questions.length) * 100}
				className="w-full mb-4 h-2 bg-purple-200"
			/>
			<Card className="bg-white shadow-md">
				<CardContent className="p-6">
					<p className="text-lg mb-4 font-semibold text-purple-600">
						Question {currentQuestionIndex + 1} of {questions.length}
					</p>
					<p className="text-xl mb-6 text-gray-800">
						{currentQuestion.scenario}
					</p>
					<div className="mb-6 p-4 border rounded bg-gray-50">
						<p className="text-sm text-gray-500 mb-2">Example:</p>
						{currentQuestion.component}
					</div>
					<p className="mb-4 text-lg text-gray-700">
						Is this a good accessibility practice?
					</p>
					<div className="flex space-x-4 mb-4">
						<Button
							onClick={() => handleAnswer(true)}
							disabled={showExplanation}
							className="bg-green-500 hover:bg-green-600 text-white"
						>
							Good Practice
						</Button>
						<Button
							onClick={() => handleAnswer(false)}
							disabled={showExplanation}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							Bad Practice
						</Button>
					</div>
					{showExplanation && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="mt-4 p-4 bg-blue-100 rounded-lg"
						>
							<p className="text-blue-800">{feedbackText}</p>
							<Button
								onClick={nextQuestion}
								className="mt-4 bg-purple-500 hover:bg-purple-600 text-white"
							>
								{currentQuestionIndex < questions.length - 1
									? "Next Question"
									: "Finish Test"}
							</Button>
						</motion.div>
					)}
				</CardContent>
			</Card>
			<p className="text-center text-lg font-semibold text-purple-800">
				Current Score: {score} / {currentQuestionIndex + 1}
			</p>
		</div>
	);
}
