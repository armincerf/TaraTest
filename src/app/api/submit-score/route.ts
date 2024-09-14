import { NextResponse } from "next/server";
import Airtable from "airtable";

// Check for required environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = "appRx8nYYOYONq1GB";

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error("Missing required environment variables");
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export async function POST(req: Request) {
  const { testName, score } = await req.json();

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  // Calculate the date for last week
  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const formattedLastWeekDate = lastWeekDate.toISOString().split("T")[0];

  try {
    // Fetch last week's score
    const lastWeekRecords = await base("Table 1")
      .select({
        filterByFormula: `AND({Date} = '${formattedLastWeekDate}', NOT({${testName}} = ''))`,
      })
      .firstPage();

    const lastWeekScore =
      lastWeekRecords.length > 0
        ? Number(lastWeekRecords[0].get(testName))
        : null;

    // Check for today's record
    const todayRecords = await base("Table 1")
      .select({
        filterByFormula: `AND({Date} = '${formattedDate}', {${testName}} = '')`,
      })
      .firstPage();

    if (todayRecords.length > 0) {
      const record = todayRecords[0];
      await base("Table 1").update([
        {
          id: record.id,
          fields: {
            [testName]: score,
          },
        },
      ]);
    } else {
      await base("Table 1").create([
        {
          fields: {
            Date: formattedDate,
            [testName]: score,
          },
        },
      ]);
    }

    let message = "Well done!";
    let scoreDifference = null;

    if (lastWeekScore !== null) {
      scoreDifference = Number(score) - lastWeekScore;
      if (scoreDifference > 0) {
        message = `Great job! You improved by ${scoreDifference} points!`;
      } else if (scoreDifference < 0) {
        message = `Keep practicing! You're ${Math.abs(scoreDifference)} points behind last week.`;
      } else {
        message = "You matched your score from last week. Keep it up!";
      }
    }

    return NextResponse.json({
      success: true,
      message,
      scoreDifference,
      lastWeekScore,
    });
  } catch (error) {
    console.error("Error updating Airtable:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update score" },
      { status: 500 },
    );
  }
}
