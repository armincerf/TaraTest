'use server';

import { createStreamableUI } from 'ai/rsc';
import { currentUser } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateMotivationalMessage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful assistant that
      generates motivational messages for users
      who are about to take tests.`,
    prompt: `Generate a motivational message for ${firstName} who is about to take a test. Keep it under 30 words.`,
  });

  return createStreamableUI(
    async function* () {
      const reader = result.toDataStream().getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        yield chunk;
      }
    }
  );
}
