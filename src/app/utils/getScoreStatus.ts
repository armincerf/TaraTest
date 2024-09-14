import { cache } from "react";
import { allTests, type ScoreStatus } from "../components/Navigation";

export type Test = {
	name: string;
	href: string;
	unit: string;
	implemented: boolean;
};

export function testId(test: Test) {
	return `${test.name} (${test.unit})`;
}

export const getScoreStatus = cache(async (): Promise<ScoreStatus> => {
	const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
	const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

	if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
		throw new Error("Missing required environment variables");
	}

	const currentDate = new Date().toISOString().split("T")[0];

	const res = await fetch(
		`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/TaraTest?filterByFormula={Date}='${currentDate}'`,
		{
			headers: {
				Authorization: `Bearer ${AIRTABLE_API_KEY}`,
			},
			next: { revalidate: 60 }, // Revalidate every 60 seconds
		},
	);

	if (!res.ok) {
		throw new Error("Failed to fetch score status");
	}

	const data = await res.json();
	const scoreStatus: ScoreStatus = {};

	// Check if a record exists for the current date
	if (data.records.length > 0) {
		const fields = data.records[0].fields;

		// Only process scores if there's a record for today
		for (const test of allTests) {
			const id = testId(test);
			if (
				fields[id] !== undefined &&
				fields[id] !== null &&
				fields[id] !== ""
			) {
				scoreStatus[id] = true;
			} else {
				scoreStatus[id] = false;
			}
		}
	} else {
		// If no record exists for today, set all scores to false
		for (const test of allTests) {
			const id = testId(test);
			scoreStatus[id] = false;
		}
	}

	return scoreStatus;
});
