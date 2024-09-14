// src/app/contexts/ScoreContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

interface ScoreStatus {
	[key: string]: boolean;
}

interface ScoreContextType {
	scoreStatus: ScoreStatus;
	updateScoreStatus: (testId: string, completed: boolean) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({
	children,
	initialScoreStatus,
}: { children: ReactNode; initialScoreStatus: ScoreStatus }) {
	const [scoreStatus, setScoreStatus] =
		useState<ScoreStatus>(initialScoreStatus);

	const updateScoreStatus = (testId: string, completed: boolean) => {
		setScoreStatus((prev) => ({ ...prev, [testId]: completed }));
	};

	return (
		<ScoreContext.Provider value={{ scoreStatus, updateScoreStatus }}>
			{children}
		</ScoreContext.Provider>
	);
}

export function useScore() {
	const context = useContext(ScoreContext);
	if (context === undefined) {
		throw new Error("useScore must be used within a ScoreProvider");
	}
	return context;
}
