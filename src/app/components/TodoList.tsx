"use client";

import { Checkbox } from "./Checkbox";
import { NavigateTo } from "./icons/NavigateTo";
import Link from "next/link";

export default function TodoList({
	items,
}: {
	items: { name: string; href: string; completed: boolean }[] | null;
}) {
	return (
		<ul className="space-y-2">
			{items?.map((test) => (
				<li key={test.name}>
					<Link href={test.href}>
						<div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
							<div className="flex items-center space-x-2">
								<Checkbox checked={test.completed} onChange={() => {}} />
								<span className="text-gray-900">{test.name}</span>
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
