"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShortcutDisplay from "./ShortcutDisplay";
import Timer from "@/app/components/Timer";
import ScoreDisplay from "@/app/components/ScoreDisplay";
import { matchShortcut, shortcuts, type Shortcut } from "./shortcuts";

export default function KeyboardShortcutTest() {
	const [isStarted, setIsStarted] = useState(false);
	const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null);
	const [showKeys, setShowKeys] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds test
	const [finalScore, setFinalScore] = useState<number | null>(null);
	const usedShortcutsRef = useRef<Set<number>>(new Set());
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const showKeysTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastShortcutRef = useRef<number | null>(null);
	const shortcutStartTimeRef = useRef<number>(0);
	const totalTimeRef = useRef<number>(0);
	const attemptCountRef = useRef<number>(0);

	const getRandomShortcut = (): Shortcut => {
		let availableIndices = shortcuts
			.map((_, index) => index)
			.filter(
				(index) =>
					!usedShortcutsRef.current.has(index) &&
					index !== lastShortcutRef.current,
			);
		if (availableIndices.length === 0) {
			usedShortcutsRef.current.clear();
			availableIndices = shortcuts
				.map((_, index) => index)
				.filter((index) => index !== lastShortcutRef.current);
		}
		const randomIndex =
			availableIndices[Math.floor(Math.random() * availableIndices.length)];
		usedShortcutsRef.current.add(randomIndex);
		lastShortcutRef.current = randomIndex;
		return shortcuts[randomIndex];
	};

	const setNewShortcut = () => {
		const newShortcut = getRandomShortcut();
		setCurrentShortcut(newShortcut);
		setShowKeys(false);
		if (showKeysTimerRef.current) {
			clearTimeout(showKeysTimerRef.current);
		}
		showKeysTimerRef.current = setTimeout(() => {
			setShowKeys(true);
		}, 3000);
		shortcutStartTimeRef.current = Date.now();
	};

	const startTest = () => {
		setIsStarted(true);
		setCorrectCount(0);
		setIncorrectCount(0);
		setTimeRemaining(60);
		setFinalScore(null);
		usedShortcutsRef.current.clear();
		lastShortcutRef.current = null;
		totalTimeRef.current = 0;
		attemptCountRef.current = 0;
		setNewShortcut();
		startTimer();
	};

	const startTimer = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					endTest();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const endTest = () => {
		setIsStarted(false);
		if (timerRef.current) clearInterval(timerRef.current);
		if (showKeysTimerRef.current) clearTimeout(showKeysTimerRef.current);

		const averageTime = totalTimeRef.current / attemptCountRef.current || 0;
		const accuracy = correctCount / (correctCount + incorrectCount) || 0;
		const timeScore = Math.max(0, 1 - averageTime / 5000); // Assuming 5 seconds is the maximum "good" time

		const finalScore = Math.round((accuracy * 0.7 + timeScore * 0.3) * 100);
		setFinalScore(finalScore);
	};

	useEffect(() => {
		if (isStarted) {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (!currentShortcut) return;
				event.preventDefault();

				console.log("Key event:", event.key, event.code);
				console.log("Modifier keys:", {
					metaKey: event.metaKey,
					ctrlKey: event.ctrlKey,
					altKey: event.altKey,
					shiftKey: event.shiftKey,
				});
				// Check if the pressed keys form a full shortcut
				const isFullShortcut =
					event.key.toLowerCase() !== "shift" &&
					event.key.toLowerCase() !== "control" &&
					event.key.toLowerCase() !== "alt" &&
					event.key.toLowerCase() !== "meta";

				if (isFullShortcut) {
					const endTime = Date.now();
					const timeTaken = endTime - shortcutStartTimeRef.current;
					totalTimeRef.current += timeTaken;
					attemptCountRef.current += 1;

					if (matchShortcut(event, currentShortcut)) {
						setCorrectCount((prev) => prev + 1);
						setNewShortcut();
					} else {
						setIncorrectCount((prev) => prev + 1);
					}
				}
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [isStarted, currentShortcut]);

	useEffect(() => {
		if (isStarted) {
			startTimer();
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (showKeysTimerRef.current) clearTimeout(showKeysTimerRef.current);
		};
	}, [isStarted]);

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 space-y-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
			<h1 className="text-4xl font-bold mb-6 text-center text-purple-800">
				Keyboard Shortcut Challenge
			</h1>

			{!isStarted && finalScore === null ? (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold"
					onClick={startTest}
				>
					Start Test
				</motion.button>
			) : isStarted ? (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-6"
					>
						<div className="flex justify-between items-center text-purple-800">
							<Timer timeRemaining={timeRemaining} />
							<ScoreDisplay correct={correctCount} incorrect={incorrectCount} />
						</div>
						{currentShortcut && (
							<div className="text-center">
								<p className="text-xl mb-4 text-purple-800 font-semibold">
									{currentShortcut.description}
								</p>
								<AnimatePresence>
									{showKeys && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
										>
											<ShortcutDisplay shortcut={currentShortcut} />
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			) : (
				<div className="text-center text-purple-800">
					<h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
					<p className="text-xl mb-2">Final Score: {finalScore}</p>
					<p>Correct: {correctCount}</p>
					<p>Incorrect: {incorrectCount}</p>
					<p>
						Average Time:{" "}
						{(totalTimeRef.current / attemptCountRef.current / 1000).toFixed(2)}{" "}
						seconds
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold"
						onClick={startTest}
					>
						Retry
					</motion.button>
				</div>
			)}
		</div>
	);
}
