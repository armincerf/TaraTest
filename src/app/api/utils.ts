import Airtable from "airtable";

const devUser = "user_2m7j9jLUcz8qtTj7lIyP88nYKXX";
export function getBaseId(userId: string) {
  return process.env.AIRTABLE_BASE_ID;
}

export function getBaseTable(userId: string) {
  console.log("userId", userId, devUser);
  if (userId === devUser) {
    return "TaraTest dev";
  }
  return "TaraTest";
}

export function getBase(userId: string) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

  if (!AIRTABLE_API_KEY) {
    throw new Error("Missing required environment variables");
  }
  const baseId = getBaseId(userId);
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(baseId);
}
