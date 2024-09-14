import { NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = "appRx8nYYOYONq1GB";

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
	throw new Error("Missing required environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export type SubmitScoreResponse = {
	success: boolean;
	percentageChange: number | null;
	previousScore: number | null;
	currentScore: number;
};

export async function POST(req: Request) {
	const { testName, score } = await req.json();

	const currentDate = new Date();
	const formattedDate = currentDate.toISOString().split("T")[0];

	try {
		// Fetch all records, sorted by date in descending order
		const allRecords = await base("TaraTest")
			.select({
				sort: [{ field: "Date", direction: "desc" }],
				filterByFormula: `NOT({Date} = '')`,
			})
			.firstPage();

		let previousScore = null;
		let currentRecord = null;

		// Find the current record (if it exists) and the previous score
		for (const record of allRecords) {
			const recordDate = record.get("Date") as string;
			if (recordDate === formattedDate) {
				currentRecord = record;
				if (record.get(testName) !== undefined) {
					previousScore = Number(record.get(testName));
				}
			} else if (previousScore === null && record.get(testName) !== undefined) {
				previousScore = Number(record.get(testName));
				break;
			}
		}

		// Update or create the record for today
		if (currentRecord) {
			await base("TaraTest").update([
				{
					id: currentRecord.id,
					fields: {
						...currentRecord.fields,
						[testName]: score,
					},
				},
			]);
		} else {
			await base("TaraTest").create([
				{
					fields: {
						Date: formattedDate,
						[testName]: score,
					},
				},
			]);
		}

		let percentageChange = null;

		if (previousScore !== null) {
			percentageChange =
				((Number(score) - previousScore) / previousScore) * 100;
		}

		const revalidateRes = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=/`,
			{
				method: "POST",
			},
		);

		if (!revalidateRes.ok) {
			console.error("Failed to revalidate");
		}
		console.log("submitted score: ", score)
		const res = {
			success: true,
			percentageChange,
			previousScore,
			currentScore: Number(score),
		} satisfies SubmitScoreResponse;

		return NextResponse.json(res);
	} catch (error) {
		console.error("Error updating Airtable:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update score" },
			{ status: 500 },
		);
	}
}
