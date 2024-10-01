import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Carousel,
} from "@/components/ui";
import Trophy from "./components/icons/Trophy";
import { ReactNode, Suspense } from "react";
import AddFriends from "./components/icons/AddFriends";
import Dumbell from "./components/icons/Dumbell";
import { TodoListIcon } from "./components/icons/TodoList";
import { TodoList } from "./components/HomePage/TodoList";
import {
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { AverageScore } from "./components/HomePage/AverageScore";
import { fetchBaseDataForDate } from "@/lib/fetchBaseData";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AverageScoreWrapper, TodoListWrapper } from "./components/HomePage/AverageScoreWrapper";


function CardButton({ children }: { children: ReactNode }) {
	return (
		<button className="w-1/2 sm:w-auto flex-shrink-0 flex flex-row justify-center items-center px-4 py-2 gap-2 bg-purple-300 border-b border-purple-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)_inset_1px_2px_4px_#DACEF7] rounded-md hover:bg-purple-400">
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
	<Card className="w-full p-4 sm:p-6">
		<CardHeader className="p-0 flex flex-row items-center justify-between gap-4 sm:flex-wrap">
			<h2 className="font-normal w-[45%] sm:w-auto sm:flex-1 min-w-[150px] break-words">{title}</h2>
			<CardButton>
				{icon}
				<span className="whitespace-nowrap">{label}</span>
			</CardButton>
		</CardHeader>
	</Card>
);

export default async function Home() {

	return (
		<div className="w-full bg-gray-100 flex sm:flex-grow text-gray-900 flex-col sm:gap-4 sm:p-4">
			<div className="flex flex-col sm:flex-row gap-8 p-2 sm:p-4">
				<Card className="w-full flex flex-col">
					<CardHeader>
						<CardTitle>Stats</CardTitle>
					</CardHeader>
					<CardContent className="h-full w-full grid">
						<Suspense fallback={<div>Loading...</div>}>
							<AverageScoreWrapper />
						</Suspense>
					</CardContent>
				</Card>
				<Card className="max-w-full sm:w-full sm:min-w-[300px] sm:max-w-[400px] h-full flex flex-col gap-4 px-6 py-4">
					<CardHeader className="flex items-center p-0">
						<CardTitle className="flex items-center gap-4">
							To Do <TodoListIcon />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 overflow-y-auto p-0">
						<Suspense fallback={<TodoList items={null} />}>
							<TodoListWrapper />
						</Suspense>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-4">
				<BottomCard
					icon={<Trophy />}
					title="Continue your streak"
					label="Daily Challenge"
				/>
				<BottomCard
					icon={<Dumbell />}
					title="Strengthen your weakest element"
					label="Take Test"
				/>
				<BottomCard
					icon={<AddFriends />}
					title="Complete a challenge"
					label="Add Friends"
				/>
			</div>
		</div>
	);
}
