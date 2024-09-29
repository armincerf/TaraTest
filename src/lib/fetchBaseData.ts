import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { allTests } from "@/app/utils/getScoreStatus";
import { cache } from "react";

const BaseDataFieldsSchema = z.object({
	"Color Harmony Test (% correct)": z.number().optional(),
	"UI Element Recognition (% correct)": z.number().optional(),
	"Accessibility Checklist (% correct)": z.number().optional(),
	"Figma Wireframe Speed (seconds)": z.number().optional(),
	"Typing Speed (WPM)": z.number().optional(),
	Date: z.string(),
	"Project Major Issues": z.number().optional(),
	"Project Minor Issues": z.number().optional(),
});

const BaseDataRecordSchema = z.object({
	createdTime: z.string(),
	fields: BaseDataFieldsSchema,
});

const AirtableResponseSchema = z.object({
	records: z.array(BaseDataRecordSchema),
});

type BaseDataFields = z.infer<typeof BaseDataFieldsSchema>;
export type ProcessedBaseData = BaseDataFields & { createdTime: string };

const potentiallyCompletedTests = allTests.map((test) => ({
	name: test.name,
	href: test.href,
	completed: false,
}));

const devUser = "user_2m7j9jLUcz8qtTj7lIyP88nYKXX";
function getBaseTable(userId: string) {
	return userId === devUser ? "TaraTest dev" : "TaraTest";
}

function fetchBaseData(userId: string, date: string) {
	const baseName = getBaseTable(userId);
	return async () => {
		console.log("Fetching data for date:", date);
		const response = await fetch(
			`https://api.airtable.com/v0/appRx8nYYOYONq1GB/${baseName}?maxRecords=100&view=Grid%20view&filterByFormula={Date}='${date}'`,
			{
				headers: {
					Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const rawData = await response.json();
		const validatedData = AirtableResponseSchema.parse(rawData);

		if (validatedData.records.length === 0) {
			return {
				Date: date,
				averageScore: 0,
				items: potentiallyCompletedTests,
			};
		}
		const record = validatedData.records[0];
		const percentFields = Object.entries(record.fields).filter(
			([key, value]) => key.includes("%") && typeof value === "number",
		);
		const scores = percentFields
			.map(([_, value]) => value)
			.filter((score) => typeof score === "number")
			.map((score) => score * 100);
		return {
			...record.fields,
			createdTime: record.createdTime,
			items: potentiallyCompletedTests
				.map((test) => ({
					...test,
					completed: Object.entries(record.fields).some(
						([key, value]) =>
							key.includes(test.name) && typeof value !== "undefined",
					),
				}))
				.sort((a, b) => a.href.localeCompare(b.href)),
			averageScore:
				scores.reduce((sum, score) => sum + score, 0) / scores.length,
		};
	};
}

export async function fetchBaseDataForDate(
	userId: string | null | undefined,
	date: string,
) {
	const dateObj = new Date(date);
	if (Number.isNaN(dateObj.getTime())) {
		return NextResponse.json({ error: "Invalid date" }, { status: 400 });
	}

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const isToday =
			dateObj.toISOString().split("T")[0] ===
			new Date().toISOString().split("T")[0];
		const fetchDataFn = fetchBaseData(userId, date);

		return isToday
			? await unstable_cache(cache(fetchDataFn), [userId, date], {
					revalidate: 6,
			})()
			: await unstable_cache(fetchDataFn, [userId, date])();
	} catch (error) {
		console.error("Error fetching score status:", error);
		return NextResponse.json(
			{ error: "Failed to fetch score status" },
			{ status: 500 },
		);
	}
}
