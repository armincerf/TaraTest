import { Skeleton } from "@/components/ui";
import { Checkbox } from "../Checkbox";
import { NavigateTo } from "../icons/NavigateTo";
import Link from "next/link";

export function TodoList({
	items,
}: {
	items: { name: string; href: string; completed: boolean }[] | null;
}) {
	const loadingItems = Array.from({ length: 15 }, (_, index) => ({
		name: `Loading item ${index + 1}`,
		href: "#",
		completed: false,
	}));
	const allItems = items || loadingItems;
	return (
		<ul className="space-y-2">
			{allItems.map((test) => (
				<li key={test.name}>
					<Link href={test.href}>
						<div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
							<div className="flex items-center space-x-2 w-full">
								<Checkbox checked={test.completed} />
								{test.name.includes("Loading item") ? (	
									<Skeleton className="w-full h-4" />
								) : (
									<span className="text-gray-900">{test.name}</span>
								)}
							</div>
							<div className="w-5 h-5">
								<NavigateTo />
							</div>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
