"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ScoreInput from "@/app/components/ScoreInput";
import { useCompletion } from "ai/react";
import { generateColorPalettes } from "@/app/utils/generateColourPalletes";
import { motion } from "framer-motion";

export default function ColorHarmonyTest() {
	const [palettes, setPalettes] = useState<
		{ colors: string[]; isHarmonious: boolean; harmonyType: string }[]
	>([]);
	const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [isTestComplete, setIsTestComplete] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const { completion, complete: generateAIResponse } = useCompletion({
		api: "/api/completion",
	});

	useEffect(() => {
		setPalettes(generateColorPalettes(10));
	}, []);

	const handleAnswer = (answer: boolean) => {
		const currentPalette = palettes[currentPaletteIndex];
		const isCorrect = answer === currentPalette.isHarmonious;

		if (isCorrect) {
			setScore(score + 1);
		}

		setFeedback(
			isCorrect
				? `Correct! This palette is ${currentPalette.isHarmonious ? "" : "not "}harmonious. ${getExplanation(currentPalette)}`
				: `Wrong. This palette is ${currentPalette.isHarmonious ? "" : "not "}harmonious. ${getExplanation(currentPalette)}`,
		);
	};

	const getExplanation = (palette: {
		isHarmonious: boolean;
		harmonyType: string;
	}) => {
		if (palette.isHarmonious) {
			return `It's an example of ${palette.harmonyType} harmony.`;
		}
		return "The colors don't follow a specific harmony rule and may clash or feel discordant.";
	};

	const nextPalette = () => {
		if (currentPaletteIndex < palettes.length - 1) {
			setCurrentPaletteIndex(currentPaletteIndex + 1);
			setFeedback(null);
		} else {
			endTest();
		}
	};

	const endTest = async () => {
		setIsTestComplete(true);
		const finalScore = (score / palettes.length) * 100;

		const aiPrompt = `Write a sentence to be displayed to a user who just completed a Color Harmony test.
    They correctly identified ${finalScore.toFixed(2)}% of the color palettes.
    Use lots of emojis and cool British slang to motivate them to keep trying.
    Make references to the average scores normal people get on these sorts of tests.`;

		await generateAIResponse(aiPrompt);
	};

	if (palettes.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (isTestComplete) {
		return (
			<div className="max-w-2xl mx-auto mt-10 p-6 bg-black rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
				<p className="text-xl mb-4">
					Your score: {((score / palettes.length) * 100).toFixed(2)}%
				</p>
				<p className="mb-6 text-lg">{completion}</p>
				<ScoreInput
					testName="Color Harmony Test (% correct)"
					scoreType="number"
					unit="score / total"
					initialScore={((score / palettes.length) * 1).toFixed(2)}
				/>
			</div>
		);
	}

	const currentPalette = palettes[currentPaletteIndex];

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-black text-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-6">
				Is this color palette harmonious?
			</h2>
			<div className="flex justify-center mb-8">
				{currentPalette.colors.map((color, index) => (
					<motion.div
						key={color}
						className="w-20 h-20 rounded-full shadow-md"
						style={{ backgroundColor: color }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: index * 0.1 }}
					/>
				))}
			</div>
			{feedback ? (
				<div className="mb-6">
					<p
						className={`text-lg mb-4 ${feedback.startsWith("Correct") ? "text-green-600" : "text-red-600"}`}
					>
						{feedback}
					</p>
					<Button onClick={nextPalette} className="w-full">
						Next
					</Button>
				</div>
			) : (
				<div className="flex justify-center space-x-4 mb-6">
					<Button onClick={() => handleAnswer(true)} className="w-1/2">
						Yes
					</Button>
					<Button onClick={() => handleAnswer(false)} className="w-1/2">
						No
					</Button>
				</div>
			)}
			<div className="bg-gray-100 rounded-full h-4 overflow-hidden">
				<div
					className="bg-blue-500 h-full"
					style={{
						width: `${((currentPaletteIndex + 1) / palettes.length) * 100}%`,
					}}
				/>
			</div>
			<p className="text-center mt-2">
				Progress: {currentPaletteIndex + 1} / {palettes.length}
			</p>
		</div>
	);
}
