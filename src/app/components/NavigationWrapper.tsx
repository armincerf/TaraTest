// src/app/components/NavigationWrapper.tsx
"use client";

import { useScore } from "../contexts/ScoreContext";
import Navigation from "./Navigation";

export default function NavigationWrapper() {
	const { scoreStatus } = useScore();

	// We pass scoreStatus as a prop to force re-render when it changes
	return <Navigation clientScoreStatus={scoreStatus} />;
}
