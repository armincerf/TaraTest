import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in AI processing:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
