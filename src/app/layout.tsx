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
					className={`${inter.className} flex flex-col min-h-screen bg-tt-orange-1`}
				>
					<SignedOut>
						<TaraTest />
					</SignedOut>
					<SignedIn>
						<ScoreInitializer>
							<NavigationWrapper />
							<main className="container mx-auto flex flex-grow overflow-auto p-4 md:p-6 w-full h-full">
								{children}
							</main>
							<footer className="container mx-auto py-4 md:py-6 text-center flex-none">
								<PersonalizedMessage />
							</footer>
						</ScoreInitializer>
					</SignedIn>
				</body>
			</html>
		</ClerkProvider>
	);
}
