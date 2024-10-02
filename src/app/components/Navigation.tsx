"use client";

import { UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import { NavItems } from "./NavItems";
import { BellIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navigation() {
	const [open, setOpen] = useState(false);

	const handleLinkClick = () => {
		setTimeout(() => {
			setOpen(false);
		}, 100);
	};

	return (
		<header className="bg-gray-100 p-2 md:px-4 flex-none w-full">
			<div className="container mx-auto flex items-center justify-between">
				<Logo />
				<div className="hidden md:block">
					<NavItems />
				</div>
				<div className="flex items-center gap-2">
					<span className="text-gray-600 hidden md:block">
						<BellIcon className="w-4 h-4" />
					</span>
					<UserButton />
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden text-black z-20">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="bg-white z-50">
							<div onClick={handleLinkClick} className="mt-6 w-28">
								<NavItems />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}