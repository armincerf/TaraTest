// src/app/components/ScoreInitializer.tsx
import { ScoreProvider } from "../contexts/ScoreContext";
import { getScoreStatus } from "@/app/utils/getScoreStatus";

export default async function ScoreInitializer({
	children,
}: { children: React.ReactNode }) {
	const initialScoreStatus = await getScoreStatus();
	console.log("initialScoreStatus", initialScoreStatus);

	return (
		<ScoreProvider initialScoreStatus={initialScoreStatus}>
			{children}
		</ScoreProvider>
	);
}
