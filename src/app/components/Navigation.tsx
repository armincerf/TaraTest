// src/app/components/Navigation.tsx
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Test } from "../utils/getScoreStatus";
import { ChevronDown } from "lucide-react";

export const allTests: Test[] = [
	{
		name: "Typing Speed",
		description: "Test your typing speed! How many wpm can you type?",
		unit: "WPM",
		href: "/typing-speed",
		implemented: true,
	},
	{
		name: "Keyboard Shortcuts",
		description:
			"Everytime you use the mouse, a fairy loses her wings! Practice your keyboard shortcuts now.",
		unit: "points",
		href: "/keyboard-shortcut-test",
		implemented: true,
	},
	{
		name: "Support Response",
		description:
			"Practice how to talk to customers!  Remember to use your AI assistant and snippets.",
		unit: "points",
		href: "/support-test",
		implemented: true,
	},
	{
		name: "Figma Wireframe Speed",
		description:
			"How fast can you create a wireframe for the prompt? Remember to open figma before starting!",
		unit: "seconds",
		href: "/figma-wireframe-speed",
		implemented: true,
	},
	{
		name: "UI Element Recognition",
		description: "Can you identify the given UI element?",
		unit: "% correct",
		href: "/ui-element-recognition",
		implemented: true,
	},

	{
		name: "Color Harmony Test",
		description: "Are these colours harmonious? Remember your colour theory!",
		unit: "% correct",
		href: "/color-harmony",
		implemented: true,
	},
	{
		name: "User Flow Completion Time",
		description: "How fast can you complete the user flow?",
		unit: "seconds",
		href: "/user-flow-completion",
		implemented: true,
	},
	{
		name: "Accessibility Checklist",
		description: "Can you recognise good accessibility practice?",
		unit: "% correct",
		href: "/accessibility-checklist",
		implemented: true,
	},
	{
		name: "Heuristic Evaluation Test",
		description: "Use your knowledge of heuristics to review the interface!",
		unit: "% correct",
		href: "/heuristic-evaluation",
		implemented: true,
	},
	{
		name: "Interaction Design Speed",
		description:
			"How fast can you complete the random task given? Remember to open figma before starting.",
		unit: "interactions/minute",
		href: "/interaction-design-speed",
		implemented: true,
	},
	{
		name: "Information Architecture Sorting",
		description: "Can you sort the information architecture?",
		unit: "% correct",
		href: "/information-architecture-sorting",
		implemented: false,
	},
	{
		name: "Visual Hierarchy Analysis",
		description: "Can you identify the visual hierarchy?",
		unit: "% correct",
		href: "/visual-hierarchy-analysis",
		implemented: false,
	},
];

const testGroups = {
	"Computer Skills": ["Typing Speed", "Keyboard Shortcuts"],
	"Support Skills": ["Support Response"],
	"Design Skills": [
		"Figma Wireframe Speed",
		"UI Element Recognition",
		"Color Harmony Test",
		"User Flow Completion Time",
		"Accessibility Checklist",
		"Heuristic Evaluation Test",
		"Interaction Design Speed",
		"Information Architecture Sorting",
		"Visual Hierarchy Analysis",
	],
};

function NavTestItem({ test }: { test: Test }) {
	return (
		<Link href={test.href}>
			<Card className="h-[100px] w-[278px] text-sm border-tt-dark-orange text-tt-grey p-2 hover:bg-tt-orange-2 transition-colors">
				<h3 className=" font-semibold">{test.name}</h3>
				<p>{test.description}</p>
			</Card>
		</Link>
	);
}

function NavDropdown({ title, tests }: { title: string; tests: string[] }) {
	return (
		<div className="relative group">
			<div className="px-2 py-2 gap-2 flex items-center bg-tt-orange-1 hover:bg-tt-orange-1/80 rounded-md cursor-pointer">
				{title}
				<ChevronDown className="h-4 w-4" />
			</div>
			<div className="absolute left-0 top-full z-10 invisible group-hover:visible">
				<div className="pt-2">
					<div className="bg-tt-orange-1 shadow-lg p-4 rounded-md">
						<div className="flex flex-row flex-wrap gap-2 w-[max-content] max-w-[600px]">
							{tests.map((testName) => {
								const test = allTests.find((t) => t.name === testName);
								if (!test) return null;
								return <NavTestItem key={test.name} test={test} />;
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export type ScoreStatus = {
	[key: string]: boolean;
};

export default function Navigation({
	isTara,
}: {
	isTara: boolean;
}) {
	return (
		<header className="p-4 md:p-6 flex-none max-w-screen-2xl mx-auto w-full">
			<div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
				<div className="text-4xl font-bold mb-4 md:mb-0">
					<Logo />

					<p
						className={cn(
							"text-xs md:text-sm",
							isTara ? "text-green-300" : "text-gray-300",
						)}
					>
						{isTara ? " (Thats me!)" : "tfw ur not tara :("}
					</p>
				</div>
				<div className="flex items-center gap-6">
					<span className="text-4xl text-tt-grey font-bold">
						Welcome to TaraTest!
					</span>
					<UserButton />
				</div>
			</div>
			<div>
				<nav className="w-full md:w-auto bg-tt-orange-2 text-tt-grey">
					<ul className="flex flex-wrap gap-4 p-2">
						{Object.entries(testGroups).map(([groupName, tests]) => (
							<li key={groupName}>
								<NavDropdown title={groupName} tests={tests} />
							</li>
						))}
					</ul>
				</nav>
			</div>
		</header>
	);
}
