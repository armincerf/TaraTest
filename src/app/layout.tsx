export const runtime = "edge";
// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScoreInitializer from "./components/ScoreInitializer";
import NavigationWrapper from "./components/NavigationWrapper";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import PersonalizedMessage from "./components/PersonalisedMessage";
import TaraTest from "./TaraTest";
import Navigation from "./components/Navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "TaraTest",
	description: "A fun and engaging testing platform for kids",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${inter.className} bg-white`}
				>
					<SignedOut>
						<TaraTest />
					</SignedOut>
					<SignedIn>
						<ScoreInitializer>
						<div className="sm:p-2 flex flex-col gap-1 h-screen w-full">
							<Navigation />
							<main className="flex flex-grow bg-gray-100 overflow-auto p-0 sm:p-4 md:p-6 w-full h-full">
								{children}
								</main>
						
						</div>
						</ScoreInitializer>
					</SignedIn>
				</body>
			</html>
		</ClerkProvider>
	);
}
