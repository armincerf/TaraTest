import { NextResponse } from "next/server";
import { type NextRequest, getBase, getBaseTable } from "../utils";

export async function GET({ req }: { req: NextRequest }) {
	const currentDate = new Date().toISOString().split("T")[0];
	const params = req.nextUrl.searchParams;

	// Check if userId is available
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const base = getBase(userId);
	const baseName = getBaseTable(userId);
	console.log("base", base, userId);

	try {
		const records = await base(baseName)
			.select({
				filterByFormula: `{Date} = '${currentDate}'`,
			})
			.firstPage();

		const scoreStatus: { [key: string]: boolean } = {};

		if (records.length > 0) {
			const todayRecord = records[0];
			const fields = todayRecord.fields as { [key: string]: unknown };

			for (const [key, value] of Object.entries(fields)) {
				if (
					key !== "Date" &&
					value !== undefined &&
					value !== null &&
					value !== ""
				) {
					scoreStatus[key] = true;
				}
			}
		}

		return NextResponse.json(scoreStatus);
	} catch (error) {
		console.error("Error fetching score status:", error);
		return NextResponse.json(
			{ error: "Failed to fetch score status" },
			{ status: 500 },
		);
	}
}
