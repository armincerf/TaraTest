"use client";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Carousel,
} from "@/components/ui";
import Trophy from "../components/icons/Trophy";
import { type ReactNode, Suspense, useState } from "react";
import AddFriends from "../components/icons/AddFriends";
import Dumbell from "../components/icons/Dumbell";
import { TodoListIcon } from "../components/icons/TodoList";
import { TodoList } from "../components/HomePage/TodoList";
import {
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { AverageScore } from "../components/HomePage/AverageScore";
import { fetchBaseDataForDate } from "@/lib/fetchBaseData";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
	AverageScoreWrapper,
	TodoListWrapper,
} from "../components/HomePage/AverageScoreWrapper";
import { Section } from "../components/Section";
import { allTests } from "../utils/getScoreStatus";
import { NavigateTo } from "../components/icons/NavigateTo";
import { cn } from "@/lib/utils";

function CardButton({ children }: { children: ReactNode }) {
	return (
		<button
			type="button"
			className="w-1/2 sm:w-auto flex-shrink-0 flex flex-row justify-center px-4 py-2 gap-2 bg-purple-300 border-b border-purple-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset_1px_2px_4px_#DACEF7] rounded-md hover:bg-purple-400"
		>
			{children}
		</button>
	);
}

interface BottomCardProps {
	icon: ReactNode;
	title: string;
	label: string;
}

const BottomCard: React.FC<BottomCardProps> = ({ icon, title, label }) => (
	<Card className="w-full p-6 flex flex-row items-center justify-between sm:gap-4 sm:flex-wrap">
		<CardHeader className="font-normal p-0 w-1/2 sm:w-auto sm:flex-1 min-w-[150px] break-words">
			{title}
		</CardHeader>
		<CardButton>
			{icon}
			<span className="whitespace-nowrap text-sm sm:text-lg">{label}</span>
		</CardButton>
	</Card>
);

export default function Learn() {
	const categories = Array.from(new Set(allTests.map((t) => t.category)));
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof allTests)[number]["category"]
	>(categories[0]);
	return (
		<Section>
			<Card className="w-full flex flex-col">
				<CardHeader>
					<CardTitle>Learn</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					{categories.map((c) => {
						const active = c === selectedCategory;
						return (
							<Button
								className={cn(active ? "bg-purple-400" : "")}
								onClick={() => setSelectedCategory(c)}
								variant="tt"
								key={c}
							>
								{c}
								<NavigateTo
									stroke={active ? "black" : "white"}
									className={cn(active ? "opacity-20" : "")}
								/>
							</Button>
						);
					})}
				</CardContent>
			</Card>
			<Card className="max-w-full sm:w-full sm:min-w-[300px] sm:max-w-[400px] h-full flex flex-col gap-4 px-6 py-4">
				<CardHeader className="flex items-center p-0">
					<CardTitle className="flex items-center gap-4">
						To Do <TodoListIcon />
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col p-0 gap-2 overflow-auto">
					{allTests
						.filter((t) => t.category === selectedCategory)
						.map((test) => {
							return (
								<Card key={test.href} className="p-4 bg-gray-100">
									<CardTitle>{test.name}</CardTitle>
									<CardDescription>{test.description}</CardDescription>
								</Card>
							);
						})}
				</CardContent>
			</Card>
		</Section>
	);
}
