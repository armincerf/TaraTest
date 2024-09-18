"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Logo from "./components/Logo";
import { useClerk } from "@clerk/nextjs";
export default function TaraTest() {
	const reviews = [
		{
			date: "16th September 2024",
			title: "TaraTest has changed my life!",
			content:
				"Ever since using TaraTest, I've noticed my skin is glowing, I'm feeling fitter and I now have the ability to befriend woodland animals!",
			author: "Tarb Davies",
		},
		{
			date: "15th September 2024",
			title: "TaraTest works great even for NonTaras!",
			content:
				"TaraTest has allowed me to become a multibillionaire, go to space and regain the affection of my wife and kids! can't praise it enough.",
			author: "MrWorldwide",
		},
		{
			date: "13th September 2024",
			title: "An incredible tool!",
			content:
				"TaraTest has made it possible for me to work on my design skills while also working part time as a doctor! it truly is possible to save lives while keeping your design skills fresh!",
			author: "BlakeDownsMD",
		},
	];

	const c = useClerk();

	return (
		<div className="flex flex-row p-4 mx-auto h-full">
			<motion.div
				className="bg-tt-orange-2 w-1/2 p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="space-y-4">
					<motion.header
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Logo />
					</motion.header>

					<motion.section
						className="space-y-6 text-left py-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<motion.h2
							className="text-4xl text-tt-grey font-semibold"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							Customer Reviews
						</motion.h2>
						{reviews.map((review) => (
							<Card key={review.title}>
								<CardHeader>
									<CardTitle>{review.title}</CardTitle>
									<CardDescription>{review.date}</CardDescription>
								</CardHeader>
								<CardContent>
									<p>{review.content}</p>
								</CardContent>
								<CardFooter>
									<p>{review.author}</p>
								</CardFooter>
							</Card>
						))}
					</motion.section>
				</div>
			</motion.div>
			<motion.div
				className="bg-tt-orange-3 flex justify-center items-center w-1/2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<Card className="bg-tt-orange-1 w-[526px]">
					<CardHeader>
						<CardTitle>
							Welcome to the worlds first Tara themed tracker app!
						</CardTitle>
					</CardHeader>
					<CardContent>Start your journey today!</CardContent>
					<CardFooter>
						<Button onClick={() => c.openSignUp()} className="bg-tt-grey mr-6">
							Create an account
						</Button>
						<Button
							onClick={() => c.openSignIn()}
							variant="outline"
							className="bg-tt-white text-tt-grey"
						>
							Sign in
						</Button>
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	);
}
