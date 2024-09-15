import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { prompt }: { prompt: string } = await req.json();

	try {
		const result = await streamText({
			model: openai("gpt-4o-mini"),
			system: `Generate two paragraphs of text
		 using easy english that an average high
			school student would understand.
		 use uk english. do not reference these
		 instructions or give away the fact that
		 you are an ai, just return the text.`,
			prompt,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error generating completion:", error);
		return NextResponse.json(
			{ error: "Failed to generate completion" },
			{ status: 500 },
		);
	}
}
