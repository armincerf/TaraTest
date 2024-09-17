"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, LogIn } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Confetti from "react-confetti";
import { useSignIn } from "@clerk/nextjs";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

function TaraStars({ count }: { count: number }) {
	return (
		<div className="flex justify-center gap-2">
			{[...Array(count)].map((_) => (
				<div key={_} className="bg-green-400 rounded drop-shadow-lg">
					<Star className="text-gray-700" fill="currentColor" />
				</div>
			))}
		</div>
	);
}

const CheckIcon = ({ checked }: { checked: boolean }) => (
	<svg
		width="32"
		height="33"
		viewBox="0 0 32 33"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Checkmark</title>
		<g filter="url(#filter0_dd_11_7)">
			<rect
				x="4"
				y="3.5"
				width="24"
				height="24"
				rx="8"
				fill={checked ? "#87EFAC" : "#BDBDBD"}
			/>
			<path
				d="M24 9.5L13 20.5L8 15.5"
				stroke="#BDBDBD"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<filter
				id="filter0_dd_11_7"
				x="0"
				y="0.5"
				width="32"
				height="32"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feMorphology
					radius="1"
					operator="dilate"
					in="SourceAlpha"
					result="effect1_dropShadow_11_7"
				/>
				<feOffset dy="1" />
				<feGaussianBlur stdDeviation="1.5" />
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
				/>
				<feBlend
					mode="normal"
					in2="BackgroundImageFix"
					result="effect1_dropShadow_11_7"
				/>
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset dy="1" />
				<feGaussianBlur stdDeviation="1" />
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
				/>
				<feBlend
					mode="normal"
					in2="effect1_dropShadow_11_7"
					result="effect2_dropShadow_11_7"
				/>
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect2_dropShadow_11_7"
					result="shape"
				/>
			</filter>
		</defs>
	</svg>
);

export default function TaraTest() {
	const [checklist, setChecklist] = useState([
		false,
		false,
		false,
		false,
		false,
	]);
	const [showFireworks, setShowFireworks] = useState(false);

	const { isLoaded, signIn } = useSignIn();

	const handleCheck = (index: number) => {
		const newChecklist = [...checklist];
		newChecklist[index] = !newChecklist[index];
		setChecklist(newChecklist);

		if (newChecklist.every((item) => item)) {
			setShowFireworks(true);
			setTimeout(() => setShowFireworks(false), 5000);
		}
	};

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

	return (
		<main className="container mx-auto p-4 md:p-6">
			<motion.div
				className=" p-6 min-h-[400px]"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="space-y-4">
					<header className="text-center">
						<motion.h1
							className="text-4xl font-bold text-green-400"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<div className="text-4xl font-extrabold md:mb-0">
								<span className="text-yellow-300">Tara</span>
								<span className="text-blue-300">Test</span>
							</div>
						</motion.h1>
						<p className="text-green-300 text-xl font-semibold">
							Are you Tara?
						</p>
						<motion.h2
							className="text-3xl font-semibold text-white py-4"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							Welcome to the world's first Tara themed tracker app!
						</motion.h2>
					</header>

					<motion.section
						className="py-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, staggerChildren: 0.1 }}
					>
						{[
							"Are you currently studying to become a UI/UX designer?",
							"Do you enjoy quick quizzes that will test your knowledge?",
							"Do you love to practice your skills daily?",
							"Do you mind if some of the features don't always work?",
							"Are you or do you know Tara?",
						].map((feature, index) => (
							<motion.div
								key={feature}
								className="flex items-center space-x-2 cursor-pointer"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								onClick={() => handleCheck(index)}
							>
								<CheckIcon checked={checklist[index]} />
								<span className="text-xl font-semibold text-white">
									{feature}
								</span>
							</motion.div>
						))}
						<motion.div
							className="text-center py-4 space-y-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1 }}
						>
							<h3 className="text-3xl font-bold text-white">
								Then this is the web app for you!
							</h3>
							<div className="flex justify-center">
								<SignIn.Root>
									<SignIn.Step name="start" className="space-y-4">
										<Clerk.GlobalError className="block text-sm text-red-400" />
										<div className="space-y-2">
											<Clerk.Connection
												name="google"
												className="bg-gray-800 text-white text-xl gap-x-3 py-2 px-4 rounded-md flex items-center justify-center"
											>
												Start your journey today! <LogIn className="w-4" />
											</Clerk.Connection>
										</div>
									</SignIn.Step>
								</SignIn.Root>
							</div>
						</motion.div>
					</motion.section>

					<motion.section
						className="space-y-4 text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.2 }}
					>
						<h3 className="text-3xl font-bold text-gray-800">
							Customer Reviews
						</h3>
						<div className="flex justify-center">
							<Card className="bg-white pt-4 my-4 w-72 mx-auto">
								<CardContent className="flex-row space-y-4">
									<TaraStars count={5} />
									<div className="text-center text-gray-700">
										<p className="text-2xl font-bold">Excellent!</p>
										<p className="text-sm">Based on 1 million reviews</p>
									</div>
									<p className="text-sm text-center">
										Powered by RateATara.com
									</p>
								</CardContent>
							</Card>

							<Carousel className="w-full max-w-xl mx-auto text-left my-4">
								<CarouselContent>
									{reviews.map((review) => (
										<CarouselItem key={review.content}>
											<Card className="bg-white px-4">
												<CardContent>
													<div className="flex justify-between items-center py-4">
														<div className="flex">
															<TaraStars count={5} />
														</div>
														<span className="text-sm font-semibold text-gray-500">
															{review.date}
														</span>
													</div>
													<span className="text-lg font-semibold">
														{review.title}
													</span>
													<span className="font-medium text-gray-500 line-clamp-2 p-0 m-0 mb-3">
														{review.content}
													</span>
													<span className="font-medium text-gray-500">
														{review.author}
													</span>
												</CardContent>
											</Card>
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						</div>
					</motion.section>
				</div>
			</motion.div>
			{showFireworks && <Confetti />}
		</main>
	);
}
