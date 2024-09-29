import { fetchBaseDataForDate } from "@/lib/fetchBaseData";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const yesterday = new Date();

const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
	const date = new Date(yesterday);
	date.setDate(yesterday.getDate() - i);
	return date;
});

const datesToShow = lastSevenDays.map(
	(date) => date.toISOString().split("T")[0],
);

export async function fetchBaseData() {
	const userId = auth().userId;
	const data = await Promise.all(
		datesToShow.map((date) => fetchBaseDataForDate(userId, date)),
	);
	return data;
}
