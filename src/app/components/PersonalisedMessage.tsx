import { OpenAI } from "openai";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";

// Set revalidation time to 1 hour
export const revalidate = 3600;

const generateMessage = cache(async () => {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			stream: false,
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
					content: `Generate a short, angry message for a user
          that includes an interesting fact about ${currentDate}.
          Keep it under 100 characters.`,
				},
			],
			max_tokens: 150,
			temperature: 0.7,
		});

		return (
			response.choices[0].message.content ||
			"Hey user, another day, another disappointment."
		);
	} catch (error) {
		console.error("Error generating message:", error);
		return "I couldn't be bothered to come up with anything special today.";
	}
});

export default async function PersonalisedMessage() {
	const message = await generateMessage();

	return (
		<div className="bg-tt-orange-2 max-w-screen-2xl mx-6">
			<p className=" text-tt-grey p-2 text-center text-2xl">
				{`Fact of the day: ${message}`}
			</p>
		</div>
	);
}

// Server Action for on-demand revalidation
export async function revalidatePersonalizedMessage() {
	"use server";
	revalidatePath("/");
}
