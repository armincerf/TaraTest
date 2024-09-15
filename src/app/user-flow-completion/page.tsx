"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as R from "remeda";
import { Button } from "@/components/ui/button";
import ScoreInput from "@/app/components/ScoreInput";
import { useCompletion } from "ai/react";
import { motion } from "framer-motion";
import {
	type Editor,
	Tldraw,
	type TLShape,
	createShapeId,
	TLShapeId,
	TLPageId,
} from "tldraw";
import "tldraw/tldraw.css";

// Define the structure for a user flow scenario
interface UserFlowScenario {
	id: number;
	description: string;
	steps: string[];
	expertTime: number; // in seconds
}

const userFlowScenarios: UserFlowScenario[] = [
	{
		id: 1,
		description: "Sign up and post a photo",
		steps: [
			"Open app",
			"Click 'Sign Up'",
			"Fill in details",
			"Verify email",
			"Log in",
			"Click 'New Post'",
			"Select photo",
			"Add caption",
			"Post",
		],
		expertTime: 45,
	},
	{
		id: 2,
		description: "Order a product and track shipping",
		steps: [
			"Browse catalog",
			"Select item",
			"Add to cart",
			"Checkout",
			"Enter shipping info",
			"Pay",
			"Confirm order",
			"View order status",
			"Track shipping",
		],
		expertTime: 60,
	},
	{
		id: 3,
		description: "Book a flight and check in",
		steps: [
			"Search flights",
			"Select flight",
			"Enter passenger info",
			"Choose seats",
			"Pay",
			"Receive confirmation",
			"Check in online",
			"Download boarding pass",
		],
		expertTime: 55,
	},
	{
		id: 4,
		description: "Register for an online course and start learning",
		steps: [
			"Visit website",
			"Click 'Sign Up'",
			"Enter personal details",
			"Verify email",
			"Log in",
			"Browse courses",
			"Select course",
			"Enroll",
			"Start course",
		],
		expertTime: 50,
	},
	{
		id: 5,
		description: "Create an event and invite friends",
		steps: [
			"Open app",
			"Log in",
			"Click 'Create Event'",
			"Enter event details",
			"Select date and time",
			"Add location",
			"Invite friends",
			"Send invitations",
			"Confirm creation",
		],
		expertTime: 40,
	},
	{
		id: 6,
		description: "Apply for a job online",
		steps: [
			"Visit job portal",
			"Search for jobs",
			"Filter results",
			"Select a job",
			"Read job description",
			"Click 'Apply Now'",
			"Upload resume",
			"Fill application form",
			"Submit application",
		],
		expertTime: 55,
	},
	{
		id: 7,
		description: "Set up a smart home device",
		steps: [
			"Unbox device",
			"Plug in device",
			"Download app",
			"Create account",
			"Log in",
			"Add new device",
			"Connect to Wi-Fi",
			"Configure settings",
			"Finish setup",
		],
		expertTime: 35,
	},
	{
		id: 8,
		description: "Renew a library book online",
		steps: [
			"Visit library website",
			"Log in to account",
			"Navigate to 'My Loans'",
			"Select book",
			"Click 'Renew'",
			"Confirm renewal",
			"Receive confirmation email",
		],
		expertTime: 25,
	},
	{
		id: 9,
		description: "Subscribe to a podcast",
		steps: [
			"Open podcast app",
			"Search for podcast",
			"Select podcast",
			"Read description",
			"Click 'Subscribe'",
			"Enable notifications",
			"Download latest episode",
		],
		expertTime: 20,
	},
	{
		id: 10,
		description: "Reserve a table at a restaurant",
		steps: [
			"Open reservation app",
			"Search for restaurant",
			"Select restaurant",
			"Choose date and time",
			"Select number of guests",
			"Provide contact details",
			"Confirm reservation",
			"Receive confirmation email",
		],
		expertTime: 30,
	},
	{
		id: 11,
		description: "File a support ticket",
		steps: [
			"Visit support page",
			"Log in to account",
			"Click 'New Ticket'",
			"Select issue category",
			"Describe issue",
			"Attach relevant files",
			"Submit ticket",
			"Receive confirmation",
		],
		expertTime: 25,
	},
	{
		id: 12,
		description: "Donate to a charity online",
		steps: [
			"Visit charity website",
			"Click 'Donate'",
			"Choose donation amount",
			"Enter personal details",
			"Provide payment information",
			"Review donation",
			"Confirm donation",
			"Receive receipt",
		],
		expertTime: 20,
	},
	{
		id: 13,
		description: "Schedule a doctor's appointment",
		steps: [
			"Open healthcare app",
			"Log in",
			"Navigate to 'Appointments'",
			"Select 'Schedule New'",
			"Choose doctor",
			"Select date and time",
			"Confirm appointment",
			"Receive confirmation",
		],
		expertTime: 30,
	},
	{
		id: 14,
		description: "Set up a recurring bill payment",
		steps: [
			"Log in to bank account",
			"Navigate to 'Payments'",
			"Select 'Add New Payee'",
			"Enter payee details",
			"Set payment amount",
			"Choose frequency",
			"Review details",
			"Confirm setup",
		],
		expertTime: 35,
	},
	{
		id: 15,
		description: "Upload and share a document",
		steps: [
			"Open cloud storage app",
			"Log in",
			"Click 'Upload'",
			"Select document",
			"Upload document",
			"Select document",
			"Click 'Share'",
			"Enter recipient's email",
			"Set permissions",
			"Send invitation",
		],
		expertTime: 25,
	},
	{
		id: 16,
		description: "Set up two-factor authentication",
		steps: [
			"Log in to account",
			"Navigate to 'Security Settings'",
			"Select 'Enable 2FA'",
			"Choose authentication method",
			"Enter phone number or email",
			"Receive verification code",
			"Enter code",
			"Confirm setup",
		],
		expertTime: 20,
	},
	{
		id: 17,
		description: "Create a playlist and add songs",
		steps: [
			"Open music app",
			"Log in",
			"Navigate to 'Playlists'",
			"Click 'Create New Playlist'",
			"Name the playlist",
			"Search for songs",
			"Add songs to playlist",
			"Save playlist",
		],
		expertTime: 15,
	},
	{
		id: 18,
		description: "Report a bug in an application",
		steps: [
			"Open app",
			"Navigate to 'Help' or 'Support'",
			"Select 'Report a Bug'",
			"Describe the issue",
			"Attach screenshots",
			"Provide contact info",
			"Submit report",
			"Receive confirmation",
		],
		expertTime: 25,
	},
	{
		id: 19,
		description: "Customize profile settings",
		steps: [
			"Log in to account",
			"Navigate to 'Profile Settings'",
			"Update profile picture",
			"Edit bio",
			"Change privacy settings",
			"Update notification preferences",
			"Save changes",
		],
		expertTime: 20,
	},
	{
		id: 20,
		description: "Sync a fitness tracker with an app",
		steps: [
			"Download fitness app",
			"Create account",
			"Log in",
			"Turn on Bluetooth",
			"Add new device",
			"Select fitness tracker",
			"Pair device",
			"Sync data",
			"Verify synchronization",
		],
		expertTime: 30,
	},
];

export default function UserFlowCompletionTest() {
	const [currentScenario, setCurrentScenario] =
		useState<UserFlowScenario | null>(null);
	const [isTestStarted, setIsTestStarted] = useState(false);
	const [isTestComplete, setIsTestComplete] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [feedback, setFeedback] = useState<string | null>(null);
	const editorRef = useRef<Editor | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number | null>(null);

	const { completion, complete: generateAIResponse } = useCompletion({
		api: "/api/completion",
	});

	// Function to select a random scenario
	const selectRandomScenario = () => {
		const randomScenario =
			userFlowScenarios[Math.floor(Math.random() * userFlowScenarios.length)];
		setCurrentScenario(randomScenario);
	};

	const selectRandomScenarioCb = useCallback(selectRandomScenario, []);

	useEffect(() => {
		// Randomly select a scenario when the component mounts
		selectRandomScenarioCb();
	}, [selectRandomScenarioCb]);

	// Function to shuffle the scenario
	const shuffleScenario = () => {
		// Reset test states
		setIsTestStarted(false);
		setIsTestComplete(false);
		hasStartedDrawing.current = false;
		setElapsedTime(0);
		setFeedback(null);
		// Clear the timer if running
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		// Clear the editor canvas
		if (editorRef.current) {
			editorRef.current.selectAll(); // Select all shapes
			editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds()); // Delete selected shapes
		}
		// Select a new random scenario
		selectRandomScenarioCb();
	};

	const startTest = () => {
		setIsTestStarted(true);
		startTimeRef.current = Date.now();
		timerRef.current = setInterval(() => {
			setElapsedTime(
				Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000),
			);
		}, 1000);
	};

	const endTest = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setIsTestComplete(true);

		if (currentScenario) {
			const timeDifference = elapsedTime - currentScenario.expertTime;
			const percentDifference =
				((elapsedTime - currentScenario.expertTime) /
					currentScenario.expertTime) *
				100;

			let feedbackMessage = "";
			if (percentDifference <= 10) {
				feedbackMessage = "Excellent! You're performing at an expert level.";
			} else if (percentDifference <= 25) {
				feedbackMessage = "Good job! You're close to expert-level performance.";
			} else if (percentDifference <= 50) {
				feedbackMessage = "Not bad, but there's room for improvement.";
			} else {
				feedbackMessage =
					"You might want to practice more to improve your speed.";
			}

			setFeedback(
				`You completed the task in ${elapsedTime} seconds. The expert time is ${currentScenario.expertTime} seconds. ${feedbackMessage}`,
			);

			const aiPrompt = `Write a short, encouraging message for a UX design student who just completed a User Flow Completion test.
They completed the "${currentScenario.description}" flow in ${elapsedTime} seconds, compared to the expert time of ${currentScenario.expertTime} seconds.
Use emojis and motivational language to encourage them to keep practicing and improving their skills.
Mention how this skill relates to real-world UX design work.`;

			await generateAIResponse(aiPrompt);
		}
	};

	const hasStartedDrawing = useRef(false);

	function drawShapes(editor: Editor) {
		setTimeout(() => {
			const watermark = document.querySelector(".tl-watermark_SEE-LICENSE");
			console.log("watermark", watermark);
			if (watermark) {
				watermark.remove();
			}
		}, 100);
		if (currentScenario) {
			const stepsRaw = currentScenario.steps;
			// shuffle steps
			const steps = R.shuffle(stepsRaw);
			const startX = 50;
			const startY = 50;
			const stepWidth = 150;
			const stepHeight = 60;
			const horizontalGap = 50;
			const verticalGap = 80;
			const containerWidth = document.body.clientWidth / 1.5 - 100;
			const maxColumns = Math.max(
				1,
				Math.floor(containerWidth / (stepWidth + horizontalGap)),
			);

			const shapePositions: Array<{ id: string; x: number; y: number }> = [];

			steps.forEach((step, index) => {
				const column = index % maxColumns;
				const row = Math.floor(index / maxColumns);

				const x = startX + column * (stepWidth + horizontalGap);
				const y = startY + row * (stepHeight + verticalGap);

				const shapeId = createShapeId();
				editor.createShape<TLShape>({
					id: shapeId,
					type: "geo",
					x,
					y,
					props: {
						w: stepWidth,
						h: stepHeight,
						geo: "rectangle",
						text: step,
					},
				});

				shapePositions.push({ id: shapeId, x, y });
			});
		}
	}

	const handleMount = (editor: Editor) => {
		editorRef.current = editor;
		editor.updateInstanceState({ isDebugMode: false });

		if (!hasStartedDrawing.current) {
			hasStartedDrawing.current = true;
			drawShapes(editor);
		}
	};

	if (!currentScenario) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="max-w-screen-xl mx-auto mt-10 p-6 bg-black text-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-6">User Flow Completion Test</h2>
			<p className="mb-4">Scenario: {currentScenario.description}</p>
			{!isTestStarted ? (
				<div>
					<p className="mb-4">
						When you're ready, click the button below to start the test. Create
						a user flow diagram for the given scenario as quickly and accurately
						as possible using the provided whiteboard.
					</p>
					<Button onClick={startTest} className="w-full mb-4">
						Start Test
					</Button>
					<Button onClick={shuffleScenario} className="w-full">
						Shuffle Scenario
					</Button>
				</div>
			) : (
				<div>
					<p className="mb-4">Time elapsed: {elapsedTime} seconds</p>
					<div
						className="mb-4 bg-white rounded-lg overflow-hidden"
						style={{ height: "600px" }}
					>
						<Tldraw onMount={handleMount} autoFocus />
					</div>
					{!isTestComplete && (
						<Button onClick={endTest} className="w-full mb-4">
							Finish Test
						</Button>
					)}
					{!isTestStarted && !isTestComplete && (
						<Button onClick={shuffleScenario} className="w-full">
							Shuffle Scenario
						</Button>
					)}
				</div>
			)}
			{isTestComplete && (
				<div className="max-w-screen-xl mx-auto mt-10 p-6 bg-black rounded-lg shadow-lg text-white">
					<h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
					<p className="text-xl mb-4">Your time: {elapsedTime} seconds</p>
					<p className="mb-4">{feedback}</p>
					<p className="mb-6 text-lg">{completion}</p>
					<ScoreInput
						testName="User Flow Completion Time (seconds)"
						scoreType="number"
						unit="seconds"
						initialScore={elapsedTime.toString()}
					/>
				</div>
			)}
		</div>
	);
}
