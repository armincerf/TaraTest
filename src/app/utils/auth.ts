"use client";

import { useUser } from "@clerk/nextjs";

export function useUserId() {
  const { isLoaded, user } = useUser();
  if (!isLoaded) return null;
  return user?.id;
}
