"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Check, X } from "lucide-react";
import ScoreInput from "@/app/components/ScoreInput";

// Define types
type Task = {
	id: number;
	description: string;
	template?: string;
	criteria: Array<{ description: string }>;
};

type Score = {
	criteriaScores: { [key: number]: boolean };
	timeTaken: number;
};

const figmaFileUrl =
	"https://www.figma.com/design/nEuTYuLeKJls4qI3BQxdvt/Untitled";

const genericCriteria: Task["criteria"] = [
	{ description: "Correct use of Autolayout" },
	{ description: "Correct use of padding/spacing" },
	{ description: "Good naming" },
];

// Sample tasks (you should expand this to 10)
const tasks: Task[] = [
	{
		id: 1,
		description: "Create a button with hover and click states",
		template: figmaFileUrl,
		criteria: [
			...genericCriteria,
			{ description: "Hover state created" },
			{ description: "Click state created" },
			{ description: "Smooth transition between states" },
		],
	},
	{
		id: 2,
		description: "Design a toggle switch animation",
		template: figmaFileUrl,
		criteria: [
			...genericCriteria,
			{ description: "On and off states clearly defined" },
			{ description: "Smooth animation between states" },
			{ description: "Accessible color contrast" },
		],
	},
	// Add 8 more tasks here
];

const InteractionDesignSpeedPage: React.FC = () => {
	const [currentTask, setCurrentTask] = useState<Task | null>(null);
	const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
	const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
	const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
	const [score, setScore] = useState<Score>({
		criteriaScores: {},
		timeTaken: 0,
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isTestStarted && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prevTime) => prevTime - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			finishTest();
		}
		return () => clearInterval(timer);
	}, [isTestStarted, timeLeft]);

	const startTest = (): void => {
		const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
		setCurrentTask(randomTask);
		setIsTestStarted(true);
		setTimeLeft(300);
		setIsTestFinished(false);
		setScore({ criteriaScores: {}, timeTaken: 0 });
	};

	const finishTest = (): void => {
		setIsTestStarted(false);
		setIsTestFinished(true);
		setScore((prevScore) => ({ ...prevScore, timeTaken: 300 - timeLeft }));
	};

	const handleCriteriaToggle = (criteriaId: number): void => {
		setScore((prevScore) => ({
			...prevScore,
			criteriaScores: {
				...prevScore.criteriaScores,
				[criteriaId]: !prevScore.criteriaScores[criteriaId],
			},
		}));
	};

	const calculateFinalScore = (): number => {
		const criteriaScore = Object.values(score.criteriaScores).filter(
			Boolean,
		).length;
		const timeBonus = Math.max(0, 300 - score.timeTaken) / 10;
		return criteriaScore * 10 + timeBonus;
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-white bg-opacity-10 rounded-lg p-8 text-center max-w-4xl mx-auto"
			>
				<h1 className="text-4xl font-bold mb-6">
					Interaction Design Speed Test
				</h1>

				{!isTestStarted && !isTestFinished && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<p className="text-xl mb-8">
							Test your interaction design skills! You'll be given a random
							Figma task to complete in 5 minutes. Make sure you have Figma open
							and ready before starting.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={startTest}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
						>
							Start Test
							<ArrowRight className="inline-block ml-2" />
						</motion.button>
					</motion.div>
				)}

				{isTestStarted && currentTask && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-2xl font-semibold mb-4">
							{currentTask.description}
						</h2>
						{currentTask.template && (
							<Link
								href={currentTask.template}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-300 hover:text-blue-100 underline"
							>
								Open Figma Template
							</Link>
						)}
						<div className="mt-8 mb-4">
							<Clock className="inline-block mr-2" />
							<span className="text-3xl font-bold">
								{Math.floor(timeLeft / 60)}:
								{(timeLeft % 60).toString().padStart(2, "0")}
							</span>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={finishTest}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
						>
							Finish
							<Check className="inline-block ml-2" />
						</motion.button>
					</motion.div>
				)}

				{isTestFinished && currentTask && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-2xl font-semibold mb-4">Self-Scoring</h2>
						<div className="space-y-4 mb-8">
							{currentTask.criteria.map((criterion) => (
								<div
									key={criterion.id}
									className="flex items-center justify-between"
								>
									<span>{criterion.description}</span>
									<button
										type="button"
										onClick={() => handleCriteriaToggle(criterion.id)}
										className={`p-2 rounded-full ${
											score.criteriaScores[criterion.id]
												? "bg-green-500"
												: "bg-red-500"
										}`}
									>
										{score.criteriaScores[criterion.id] ? <Check /> : <X />}
									</button>
								</div>
							))}
						</div>
						<div className="text-2xl font-bold mb-4">
							Final Score: {calculateFinalScore().toFixed(1)}
						</div>
						<p className="mb-8">
							Time taken: {score.timeTaken} seconds. Great effort! Keep
							practicing to improve your speed and accuracy.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={startTest}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
						>
							Submit Score
							<ArrowRight className="inline-block ml-2" />
						</motion.button>
					</motion.div>
				)}
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className="mt-12 bg-white bg-opacity-10 rounded-lg p-8 max-w-4xl mx-auto"
			>
				<h2 className="text-2xl font-semibold mb-4">Figma Tips</h2>
				<ul className="list-disc list-inside space-y-2">
					<li>Use 'R' to create a rectangle</li>
					<li>Press 'T' for the text tool</li>
					<li>'Ctrl/Cmd + D' to duplicate objects</li>
					<li>'Shift + A' to auto-layout frames</li>
				</ul>
				<Link
					href="https://help.figma.com/hc/en-us/articles/360040328653-Use-keyboard-shortcuts-and-hotkeys"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-300 hover:text-blue-100 underline mt-4 inline-block"
				>
					Learn more Figma shortcuts
				</Link>
			</motion.div>
		</>
	);
};

export default InteractionDesignSpeedPage;
