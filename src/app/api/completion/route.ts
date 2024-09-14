import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { prompt }: { prompt: string } = await req.json();

	try {
		const result = await streamText({
			model: openai("gpt-4o-mini"),
			system: `You are a helpful assistant that
			 generates motivational messages for users
			 who have completed tests.
			 Your responses should be encouraging,
			 use British slang, and include emojis.
				You should not include prompts or
				expose the fact that you are an ai in your response
				because your response will be shown directly
				to the end user.

				Start the response with a completely insane phrase that a british person from a douglas adams book might say`,
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
