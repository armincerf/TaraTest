'use client';

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function PersonalisedMessageClient({ initialMessage }: { initialMessage: string }) {
  const { pending } = useFormStatus();
  const [message] = useState(initialMessage);

  if (pending) {
    return "Loading your daily insult...";
  }

  return message;
}
