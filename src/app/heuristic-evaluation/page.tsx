"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AutoScoreSubmission } from "@/app/components/ScoreInput";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface Heuristic {
	id: string;
	name: string;
	description: string;
}

const heuristics: Heuristic[] = [
	{
		id: "1",
		name: "Visibility of system status",
		description:
			"The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.",
	},
	{
		id: "2",
		name: "Match between system and the real world",
		description:
			"The system should speak the users' language, with words, phrases, and concepts familiar to the user.",
	},
	{
		id: "3",
		name: "User control and freedom",
		description:
			"Users often choose system functions by mistake and need a clearly marked 'emergency exit' to leave.",
	},
	{
		id: "4",
		name: "Consistency and standards",
		description:
			"Users should not have to wonder whether different words, situations, or actions mean the same thing.",
	},
	{
		id: "5",
		name: "Error prevention",
		description:
			"Design the system to prevent errors from occurring in the first place.",
	},
	{
		id: "6",
		name: "Recognition rather than recall",
		description:
			"Minimize the user's memory load by making objects, actions, and options visible.",
	},
	{
		id: "7",
		name: "Flexibility and efficiency of use",
		description:
			"Allow users to tailor frequent actions and provide accelerators for experienced users.",
	},
	{
		id: "8",
		name: "Aesthetic and minimalist design",
		description:
			"Interfaces should not contain information that is irrelevant or rarely needed.",
	},
	{
		id: "9",
		name: "Help users recognize, diagnose, and recover from errors",
		description:
			"Error messages should be expressed in plain language and suggest a solution.",
	},
	{
		id: "10",
		name: "Help and documentation",
		description:
			"Provide help and documentation that is easy to search and focused on the user's task.",
	},
];

interface Issue {
	heuristicId: string;
	description: string;
}

interface UIComponent {
	id: string;
	component: JSX.Element;
	issues: Issue[];
}

function generateMockUI(): UIComponent[] {
	const headerCorrect: UIComponent = {
		id: "header-correct",
		component: (
			<header key="header" className="bg-gray-800 text-white p-4 mb-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">MockApp</h1>
					<nav>
						<ul className="flex space-x-4">
							<li className="hover:text-blue-300">Home</li>
							<li className="hover:text-blue-300">Products</li>
							<li className="hover:text-blue-300">About</li>
							<li className="hover:text-blue-300">Contact</li>
						</ul>
					</nav>
				</div>
			</header>
		),
		issues: [],
	};

	const headerIncorrect: UIComponent = {
		id: "header-incorrect",
		component: (
			<header key="header" className="bg-gray-800 text-white p-4 mb-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">MockApp</h1>
					<nav>
						<ul className="flex space-x-4">
							<li className="text-blue-300">Home</li>
							<li>Products</li>
							<li className="text-green-300">About</li>
							<li>Contact</li>
						</ul>
					</nav>
				</div>
			</header>
		),
		issues: [
			{
				heuristicId: "4",
				description: "Inconsistent styling of navigation items in the header.",
			},
		],
	};

	const footerCorrect: UIComponent = {
		id: "footer-correct",
		component: (
			<footer key="footer" className="bg-gray-800 text-white p-4 mt-6">
				<div className="flex justify-between">
					<div>© 2024 MockApp. All rights reserved.</div>
					<nav>
						<ul className="flex space-x-4">
							<li className="hover:text-blue-300 cursor-pointer">
								Privacy Policy
							</li>
							<li className="hover:text-blue-300 cursor-pointer">
								Terms of Service
							</li>
							<li className="hover:text-blue-300 cursor-pointer">Contact Us</li>
						</ul>
					</nav>
				</div>
			</footer>
		),
		issues: [],
	};

	const footerIncorrect: UIComponent = {
		id: "footer-incorrect",
		component: (
			<footer key="footer" className="bg-gray-800 text-white p-4 mt-6">
				<div className="flex justify-between">
					<div>© 2024 MockApp. All rights reserved.</div>
					<nav>
						<ul className="flex space-x-4">
							<li>Privacy Policy</li>
							<li>Terms of Service</li>
							<li>Contact Us</li>
						</ul>
					</nav>
				</div>
			</footer>
		),
		issues: [
			{
				heuristicId: "7",
				description:
					"Footer links are not easily distinguishable or interactive.",
			},
		],
	};

	const otherComponents: UIComponent[] = [
		{
			id: "search-section",
			component: (
				<section key="search-section" className="mb-6">
					<div className="flex">
						<Input className="flex-grow mr-2" />
						<Button>Search</Button>
					</div>
				</section>
			),
			issues: [
				{
					heuristicId: "6",
					description:
						"The search input lacks a placeholder or label to indicate its purpose.",
				},
			],
		},
		{
			id: "product-list",
			component: (
				<section key="product-list" className="mb-6">
					<h2 className="text-xl font-semibold mb-2">Featured Products</h2>
					<div className="grid grid-cols-3 gap-4">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="p-4">
								<img
									src={`https://via.placeholder.com/150?text=Product ${i}`}
									alt={`Product ${i}`}
									className="mb-2"
								/>
								<h3 className="font-bold">Product {i}</h3>
								<p className="text-sm text-gray-600">
									Description for Product {i}
								</p>
								<Button className="mt-2 w-full">Add to Cart</Button>
							</Card>
						))}
					</div>
				</section>
			),
			issues: [
				{
					heuristicId: "5",
					description:
						"No confirmation or undo option when adding products to the cart.",
				},
			],
		},
		{
			id: "newsletter-signup",
			component: (
				<section
					key="newsletter-signup"
					className="mb-6 bg-gray-100 p-4 rounded"
				>
					<h2 className="text-xl font-semibold mb-2">
						Subscribe to Our Newsletter
					</h2>
					<form className="flex">
						<Input
							type="email"
							placeholder="Enter your email"
							className="flex-grow mr-2"
						/>
						<Button
							onClick={(e) => {
								e.preventDefault();
								alert("Subscribed!");
							}}
							type="submit"
						>
							Subscribe
						</Button>
					</form>
				</section>
			),
			issues: [
				{
					heuristicId: "9",
					description:
						"No error message or validation for invalid email addresses.",
				},
			],
		},
	];

	// Randomly select header and footer (correct or incorrect)
	const selectedHeader = Math.random() < 0.5 ? headerCorrect : headerIncorrect;
	const selectedFooter = Math.random() < 0.5 ? footerCorrect : footerIncorrect;

	// Randomly select 1-2 other components
	const selectedOtherComponents = otherComponents
		.sort(() => 0.5 - Math.random())
		.slice(0, Math.floor(Math.random() * 2) + 1);

	return [selectedHeader, ...selectedOtherComponents, selectedFooter];
}

interface Results {
	score: number;
	totalCorrect: number;
	matched: number;
	correctHeuristics: string[];
}

export default function HeuristicEvaluationTest(): JSX.Element {
	const [mockUI, setMockUI] = useState<UIComponent[]>([]);
	const [selectedHeuristics, setSelectedHeuristics] = useState<string[]>([]);
	const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
	const [results, setResults] = useState<Results | null>(null);

	useEffect(() => {
		const ui = generateMockUI();
		setMockUI(ui);
	}, []);

	const handleToggleHeuristic = (heuristicId: string): void => {
		setSelectedHeuristics((prevSelected) => {
			if (prevSelected.includes(heuristicId)) {
				return prevSelected.filter((id) => id !== heuristicId);
			}
			if (prevSelected.length < 3) {
				return [...prevSelected, heuristicId];
			}
			return prevSelected;
		});
	};

	const finishTest = (): void => {
		// Collect the heuristics that are violated in the mockUI
		const correctHeuristicsSet = new Set<string>();
		mockUI.forEach((component) => {
			component.issues.forEach((issue) => {
				correctHeuristicsSet.add(issue.heuristicId);
			});
		});
		const correctHeuristics = Array.from(correctHeuristicsSet);

		// Compare with user's selected heuristics
		const matchedHeuristics = selectedHeuristics.filter((id) =>
			correctHeuristics.includes(id),
		);

		const score = matchedHeuristics.length / correctHeuristics.length;

		setResults({
			score,
			totalCorrect: correctHeuristics.length,
			matched: matchedHeuristics.length,
			correctHeuristics,
		});

		setIsTestComplete(true);
	};

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6">
			<h1 className="text-4xl font-bold mb-6 text-center">
				Heuristic Evaluation Test
			</h1>
			<p className="text-lg mb-4">
				Review the interface below and select up to 3 heuristics that you
				believe are violated.
			</p>
			<div className="mb-6 border p-4 rounded-md bg-white text-black">
				{mockUI.map((component) => (
					<React.Fragment key={component.id}>
						{component.component}
					</React.Fragment>
				))}
			</div>
			<div className="mb-6 bg-white text-black rounded-lg p-4">
				<p className="text-lg mb-2">Select up to 3 heuristics:</p>
				<div className="grid grid-cols-1 gap-2">
					{heuristics.map((heuristic) => {
						const isChecked = selectedHeuristics.includes(heuristic.id);
						const isDisabled = !isChecked && selectedHeuristics.length >= 3;
						return (
							<div key={heuristic.id} className="flex items-center">
								<Checkbox
									id={heuristic.id}
									checked={isChecked}
									onCheckedChange={() => handleToggleHeuristic(heuristic.id)}
									disabled={isDisabled}
								/>
								<Label
									htmlFor={heuristic.id}
									className="ml-2 flex items-center"
								>
									{heuristic.name}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<InfoCircledIcon className="ml-2 h-4 w-4 text-gray-500 cursor-help" />
											</TooltipTrigger>
											<TooltipContent>
												<p>{heuristic.description}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
							</div>
						);
					})}
				</div>
			</div>
			{!isTestComplete && (
				<>
					<p className="text-sm mt-2">You can select up to 3 heuristics.</p>
					<Button onClick={finishTest} className="w-full">
						Finish Test
					</Button>
				</>
			)}
			{isTestComplete && results && (
				<Card className="max-w-2xl mx-auto mt-10">
					<CardContent className="p-6">
						<h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
						<p className="text-xl mb-4">
							You correctly identified {results.matched} out of{" "}
							{results.totalCorrect} heuristic violations.
						</p>
						The correct heuristics were:
						<ul>
							{results.correctHeuristics.map((id) => (
								<li key={id}>{heuristics.find((h) => h.id === id)?.name}</li>
							))}
						</ul>
						<p className="text-xl mb-4">
							Your score: {(results.score * 100).toFixed(2)}%
						</p>
						<AutoScoreSubmission
							testName="Heuristic Evaluation Test (% correct)"
							score={results.score}
							unit="(1 is 100% correct, 0.5 is 50% etc. read the answer as a percentage)"
							isHigherBetter={true}
							prompt={`Tara completed a Heuristic Evaluation test, identifying usability issues in a mock interface.

							The randomly selected interface components were:
						  ${mockUI.map((component) => component.issues.map((issue) => issue.description)).join(", ")}
						  and tara selected the following heuristics:
								${selectedHeuristics.map((id) => heuristics.find((h) => h.id === id)?.name).join(", ")}

																					Please explain the heuristics that were violated in the interface components and why she was wrong if she missed any.

							`}
						/>
						<Button
							onClick={() => window.location.reload()}
							className="w-full mt-4"
						>
							Take the Test Again
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
