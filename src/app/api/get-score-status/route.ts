import { NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("Missing required environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function GET() {
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const records = await base("TaraTest")
      .select({
        filterByFormula: `{Date} = '${currentDate}'`
      })
      .firstPage();

    const scoreStatus: { [key: string]: boolean } = {};

    if (records.length > 0) {
      const todayRecord = records[0];
      const fields = todayRecord.fields as { [key: string]: unknown };

      for (const [key, value] of Object.entries(fields)) {
        if (key !== 'Date' && value !== undefined && value !== null && value !== '') {
          scoreStatus[key] = true;
        }
      }
    }

    return NextResponse.json(scoreStatus);
  } catch (error) {
    console.error("Error fetching score status:", error);
    return NextResponse.json(
      { error: "Failed to fetch score status" },
      { status: 500 }
    );
  }
}
