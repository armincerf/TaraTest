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
          className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white`}
        >
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <ScoreInitializer>
              <NavigationWrapper />
              <main className="container mx-auto p-4 md:p-6">{children}</main>
              <footer className="container mx-auto p-4 md:p-6 text-center">
                <p className="text-lg font-semibold">
                  You've got this! Every test is a chance to learn and grow. 🌟
                </p>
              </footer>
            </ScoreInitializer>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
