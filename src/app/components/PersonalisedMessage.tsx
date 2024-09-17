import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { PersonalisedMessageClient } from "./PersonalisedMessageClient";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function generateDailyMessage(name: string, date: string) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `You are a rude and unhelpful assistant that provides interesting facts about the current day
          and creates personalized greetings.
          Respond in an angry, angsty tone, insulting the user.
          Despite your irritation, you must still complete the task.
          find a sort of polite way to tell them they are eating too much`,
				},
				{
					role: "user",
					content: `Generate a short, angry message for ${name}
          that includes an interesting fact about ${date}.
          Keep it under 100 characters.`,
				},
			],
			max_tokens: 150,
			temperature: 0.7,
		});

		return (
			response.choices[0].message.content ||
			`Hey ${name}, another day, another disappointment.`
		);
	} catch (error) {
		console.error("Error generating message:", error);
		return `Hey ${name}, I couldn't be bothered to come up with anything special today.`;
	}
}

export default async function AIFooter() {
	const user = await currentUser();
	const firstName = user?.firstName || "nobody";
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const message = await generateDailyMessage(firstName, currentDate);

	return (
		<div className="bg-white h-full p-4 bg-opacity-20">
			<p className="bg-gray-800 text-white py-4 px-4 text-center text-sm">
				<Suspense fallback="Preparing your daily dose of rudeness...">
					<PersonalisedMessageClient initialMessage={message} />
				</Suspense>
			</p>
		</div>
	);
}
