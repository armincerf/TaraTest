import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Carousel,
} from "@/components/ui";
import Trophy from "./components/icons/Trophy";
import { ReactNode } from "react";
import AddFriends from "./components/icons/AddFriends";
import Dumbell from "./components/icons/Dumbell";
import { TodoListIcon } from "./components/icons/TodoList";
import TodoList from "./components/TodoList";
import {
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { AverageScore } from "./components/charts/AverageScore";
import { fetchBaseDataForDate } from "@/lib/fetchBaseData";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const yesterday = new Date();

const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
	const date = new Date(yesterday);
	date.setDate(yesterday.getDate() - i);
	return date;
});

const datesToShow = lastSevenDays.map(
	(date) => date.toISOString().split("T")[0],
);

interface BottomCardProps {
	icon: ReactNode;
	title: string;
	label: string;
}

const BottomCard: React.FC<BottomCardProps> = ({ icon, title, label }) => (
	<Card className="w-full flex flex-col justify-center items-center gap-3">
		<CardHeader className="flex justify-center items-center">
			<CardTitle className="font-normal">{title}</CardTitle>
			<CardTitle className="flex flex-row gap-2 items-center font-normal">
				{icon}
				{label}
			</CardTitle>
		</CardHeader>
	</Card>
);

export default async function Home() {
	const userId = auth().userId;
	const data = await Promise.all(
		datesToShow.map((date) => fetchBaseDataForDate(userId, date)),
	);
	const todaysData = data[data.length - 1];
	// if NextResponse error, return empty array
	if (todaysData instanceof NextResponse) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="bg-gray-100 flex flex-grow text-gray-900 flex-col gap-4 p-4">
			<div className="flex flex-row gap-8 h-2/3 p-4">
				<Card className="w-full flex flex-col">
					<CardHeader>
						<CardTitle>Stats</CardTitle>
					</CardHeader>
					<CardContent className="h-full w-full grid">
						<AverageScore initialData={data} />
					</CardContent>
				</Card>
				<Card className="w-[335px] h-full flex flex-col gap-4 px-6 py-4">
					<CardHeader className="flex items-center p-0">
						<CardTitle className="flex items-center gap-4">
							To Do <TodoListIcon />
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 overflow-y-auto p-0">
						<TodoList items={todaysData.items} />
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-row gap-8 h-1/3 p-4">
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
