// src/app/components/ScoreInitializer.tsx
import { ScoreProvider } from "../contexts/ScoreContext";
import { getScoreStatus } from "@/app/utils/getScoreStatus";
import { auth } from "@clerk/nextjs/server";

export default async function ScoreInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    return "no user";
  }
  const initialScoreStatus = await getScoreStatus(userId);

  return (
    <ScoreProvider initialScoreStatus={initialScoreStatus}>
      {children}
    </ScoreProvider>
  );
}
