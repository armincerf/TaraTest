"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import WordSet from "./WordSet";
import useTimer from "@/app/hooks/useTimer";
import { useCompletion } from "ai/react";
import { AutoScoreSubmission } from "@/app/components/ScoreInput";

export function TypingTest() {
	const [typedWordList, setTypedWordList] = useState<string[]>([""]);
	const [activeWordIndex, setActiveWordIndex] = useState(0);
	const [mistypeCount, setMistypeCount] = useState(0);
	const [testStatus, setTestStatus] = useState(0); // -1: Test end, 0: Test waiting, 1: Test running
	const [wordSet, setWordSet] = useState<string[]>([]);
	const [result, setResult] = useState({
		wpm: 0,
		accuracy: 0,
		correct: 0,
		incorrect: 0,
		extra: 0,
		missed: 0,
	});

	const [time, setTimer] = useTimer(() => setTestStatus(-1));
	const wordRef = useCallback((node: HTMLDivElement) => {
		if (node !== null) node.scrollIntoView({ block: "center" });
	}, []);
	const main = useRef<HTMLInputElement>(null);

	const { completion: typingTest, complete: generateTypingTest } =
		useCompletion({
			api: "/api/typing-test-ai",
		});

	const handleKeyPress = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (testStatus === 0) {
			setTimer(60); // 1 minute timer
			setTestStatus(1);
		}
		const typed = event.target.value;

		if (
			typed.slice(-1) !== " " &&
			typed.slice(-1) !==
				wordSet[activeWordIndex].charAt(typedWordList.at(-1)?.length || 0)
		) {
			setMistypeCount((prev) => prev + 1);
		}

		setTypedWordList(typed.split(" "));
	};

	const reset = useCallback(() => {
		setTypedWordList([""]);
		setActiveWordIndex(0);
		setMistypeCount(0);
		setTestStatus(0);
		setTimer(0);
		if (main.current) main.current.value = "";
		main.current?.focus();
	}, [setTimer]);

	const newSet = useCallback(() => {
		generateTypingTest("Generate a paragraph for a typing test.");
	}, [generateTypingTest]);

	useEffect(() => {
		if (typingTest) {
			setWordSet(typingTest.split(" "));
			reset();
		}
	}, [typingTest, reset]);

	useEffect(() => {
		if (typedWordList.length > wordSet.length) setTestStatus(-1);
		else setActiveWordIndex(typedWordList.length - 1);
	}, [typedWordList, wordSet]);

	useEffect(() => {
		newSet();
	}, [newSet]);

	useEffect(() => {
		if (testStatus !== -1) return;
		let correct = 0;
		let incorrect = 0;
		let extra = 0;
		let missed = 0;
		let space = 0;
		typedWordList.forEach((typedWord, i) => {
			typedWord.split("").forEach((typedChar, j) => {
				if (wordSet[i].charAt(j) === typedChar) correct++;
				else if (wordSet[i].charAt(j) === "") extra++;
				else incorrect++;
			});
			if (
				typedWord.length < wordSet[i]?.length &&
				typedWordList.length !== i + 1
			)
				missed += wordSet[i].length - typedWord.length;
		});
		space = typedWordList.length - 1;
		const accuracy =
			Math.floor((correct / (correct + mistypeCount)) * 100) || 0;
		const wpm =
			accuracy >= 40 ? Math.floor((correct + space) / 5 / (time / 60)) : 0;
		setResult({ wpm, accuracy, correct, incorrect, extra, missed });
		setTimer(0);
	}, [testStatus, typedWordList, wordSet, mistypeCount, time, setTimer]);

	return (
		<div className="bg-white text-black">
			<div
				className="flex flex-col justify-center h-full mb-12"
				onFocus={() => main.current?.focus()}
			>
				{testStatus === -1 ? (
					<>
						<Result {...result} handleNewSet={newSet} handleRetrySet={reset} />
						<AutoScoreSubmission
							testName="Typing Speed"
							score={result.wpm}
							unit="WPM"
							isHigherBetter={true}
							prompt={`The user completed a 1-minute typing test with ${result.wpm} WPM and ${result.accuracy}% accuracy.`}
						/>
					</>
				) : (
					<div title="typing test">
						<input
							className="absolute z-[-1] opacity-0"
							ref={main}
							onChange={handleKeyPress}
						/>
						<Timer timeLeft={Math.floor(time)} />
						<WordSet
							wordList={wordSet.slice(0, activeWordIndex + 50)}
							typedWordList={typedWordList}
							activeWordIndex={activeWordIndex}
							wordRef={wordRef}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => (
	<div className="text-center text-2xl font-bold mb-4">{timeLeft}</div>
);

const Result: React.FC<{
	wpm: number;
	accuracy: number;
	correct: number;
	incorrect: number;
	extra: number;
	missed: number;
	handleNewSet: () => void;
	handleRetrySet: () => void;
}> = ({
	wpm,
	accuracy,
	correct,
	incorrect,
	extra,
	missed,
	handleNewSet,
	handleRetrySet,
}) => (
	<div className="text-center">
		<h2 className="text-3xl font-bold mb-4">Result</h2>
		<p className="text-xl mb-2">WPM: {wpm}</p>
		<p className="text-xl mb-2">Accuracy: {accuracy}%</p>
		<p className="mb-1">Correct: {correct}</p>
		<p className="mb-1">Incorrect: {incorrect}</p>
		<p className="mb-1">Extra: {extra}</p>
		<p className="mb-4">Missed: {missed}</p>
		<button
			onClick={handleNewSet}
			type="button"
			className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
		>
			New Test
		</button>
		<button
			onClick={handleRetrySet}
			type="button"
			className="bg-green-500 text-white px-4 py-2 rounded"
		>
			Retry
		</button>
	</div>
);
