// src/app/components/NavigationWrapper.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useScore } from "../contexts/ScoreContext";
import Navigation from "./Navigation";

export default function NavigationWrapper() {
  const { scoreStatus } = useScore();
  const { isLoaded, user } = useUser();
  const isTara =
    isLoaded && user?.primaryEmailAddress?.emailAddress.includes("tara");

  // We pass scoreStatus as a prop to force re-render when it changes
  return <Navigation isTara={!!isTara} clientScoreStatus={scoreStatus} />;
}
