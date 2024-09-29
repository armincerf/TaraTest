"use client";
import { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import type { fetchBaseDataForDate } from "@/lib/fetchBaseData";
import { NextResponse } from "next/server";

export function AverageScore({
	initialData,
}: { initialData: Awaited<ReturnType<typeof fetchBaseDataForDate>>[] | null }) {
	const [options, setOptions] = useState<AgChartOptions>({
		// Data: Data to be displayed in the chart
		data: [],
		// Series: Defines which chart type and data to use
		series: [
			{
				type: "bar",
				xKey: "date",
				yKey: "score",
			},
		],
	});

	useEffect(() => {
		if (initialData && initialData.length > 0) {
			setOptions((prevOptions) => ({
				...prevOptions,
				data: initialData.map((data) => {
					if (data instanceof NextResponse) {
						return null;
					}
					return {
						date: data.Date,
						score: data.averageScore,
					};
				})
				.filter((item): item is { date: string; score: number } => item !== null)
				.sort((a, b) => a.date.localeCompare(b.date)),
			}));
		}
	}, [initialData]);

	return <AgCharts options={options} />;
}
