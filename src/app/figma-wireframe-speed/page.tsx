"use client";

import { useState, useEffect } from "react";
import { useCompletion } from "ai/react";
import { Button } from "@/components/ui/button";
import ScoreInput from "@/app/components/ScoreInput";

export default function FigmaWireframeSpeedTest() {
	const [isTestStarted, setIsTestStarted] = useState(false);
	const [time, setTime] = useState(0);
	const [isTestComplete, setIsTestComplete] = useState(false);

	const { completion, complete } = useCompletion({
		api: "/api/completion",
	});

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isTestStarted && !isTestComplete) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isTestStarted, isTestComplete]);

	const startTest = async () => {
		setIsTestStarted(true);
		setTime(0);
		setIsTestComplete(false);
		await complete(`Generate a Figma wireframe prompt of similar difficulty to:

Create a login flow for a desktop with a resolution of 1920x1080.

There should be a centered component with a username and password text field, a 'reset password' button and a 'sign in' button.

Under the sign in button it should say 'OR' and then a login with google button.

Use formal english and keep the prompt short.

This is to be shown to a trainee designer to test their wireframing skills.

Do not include any text referencing these instructions.`);
	};

	const endTest = () => {
		setIsTestComplete(true);
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Figma Wireframe Speed Test</h1>
			{!isTestStarted && (
				<>
					<p className="mb-4">
						Click the button below to start the test. You will be given a prompt
						to create a Figma wireframe. Once you have completed the wireframe,
						click the "End Test" button.
					</p>
					<p className="mb-4">
						You will be timed from the moment you start the test until you click
						"End Test" so make sure figma is open and ready to go before you start.
					</p>
					<Button onClick={startTest}>Start Test</Button>
				</>
			)}
			{isTestStarted && !isTestComplete && (
				<div>
					<p className="mb-4">Time: {formatTime(time)}</p>
					<div className="bg-blue-100 p-4 rounded-md mb-4 text-black">
						<h2 className="font-bold mb-2">Prompt:</h2>
						<pre className="whitespace-pre-wrap">{completion}</pre>
					</div>
					<Button onClick={endTest}>End Test</Button>
				</div>
			)}
			{isTestComplete && (
				<div>
					<p className="mb-4">Your time: {formatTime(time)}</p>
					<div className="bg-blue-100 p-4 rounded-md mb-4 text-black">
						<h2 className="font-bold mb-2">Prompt:</h2>
						<p>{completion}</p>
					</div>
					<ScoreInput
						isHigherBetter={false}
						testName="Figma Wireframe Speed (seconds)"
						scoreType="number"
						unit="seconds"
						initialScore={time.toString()}
						prompt={completion}
					/>
				</div>
			)}
		</div>
	);
}
