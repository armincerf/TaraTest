// src/app/components/Navigation.tsx
import Link from "next/link";
import ScoreIndicator from "./ScoreIndicator";
import { type Test, testId } from "../utils/getScoreStatus";

export const allTests: Test[] = [
	{
		name: "Typing Speed",
		unit: "WPM",
		href: "/typing-speed",
		implemented: true,
	},
	{
		name: "Figma Wireframe Speed",
		unit: "seconds",
		href: "/figma-wireframe-speed",
		implemented: true,
	},
	{
		name: "UI Element Recognition",
		unit: "% correct",
		href: "/ui-element-recognition",
		implemented: true,
	},

	{
		name: "Color Harmony Test",
		unit: "% correct",
		href: "/color-harmony",
		implemented: true,
	},
	{
		name: "User Flow Completion Time",
		unit: "seconds",
		href: "/user-flow-completion",
		implemented: true,
	},
	{
		name: "Accessibility Checklist",
		unit: "% correct",
		href: "/accessibility-checklist",
		implemented: true,
	},
	{
		name: "Heuristic Evaluation Test",
		unit: "% correct",
		href: "/heuristic-evaluation",
		implemented: true,
	},
	{
		name: "Interaction Design Speed",
		unit: "interactions/minute",
		href: "/interaction-design-speed",
		implemented: false,
	},
	{
		name: "Information Architecture Sorting",
		unit: "% correct",
		href: "/information-architecture-sorting",
		implemented: false,
	},
	{
		name: "Visual Hierarchy Analysis",
		unit: "% correct",
		href: "/visual-hierarchy-analysis",
		implemented: false,
	},
];

export type ScoreStatus = {
	[key: string]: boolean;
};

export default function Navigation({
	clientScoreStatus,
}: { clientScoreStatus?: ScoreStatus }) {
	console.log(clientScoreStatus);
	return (
		<header className="p-4 md:p-6 bg-white bg-opacity-10">
			<div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
				<div className="text-4xl font-bold mb-4 md:mb-0">
					<span className="text-yellow-300">Tara</span>
					<span className="text-blue-300">Test</span>
				</div>
				<nav className="w-full md:w-auto">
					<ul className="flex flex-wrap justify-center gap-2 md:gap-4">
						{allTests.map((test) => {
							const id = testId(test);
							return (
								<li
									key={id}
									className={
										test.implemented ? "" : "opacity-50 cursor-not-allowed"
									}
								>
									{test.implemented ? (
										<Link
											href={test.href}
											className="text-xs md:text-sm bg-white bg-opacity-20 px-2 py-1 md:px-3 md:py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 inline-block"
										>
											{test.name} <ScoreIndicator testId={id} />
										</Link>
									) : (
										<span className="text-xs md:text-sm bg-white bg-opacity-20 px-2 py-1 md:px-3 md:py-2 rounded-full inline-block">
											{test.name} (Coming Soon)
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</header>
	);
}
