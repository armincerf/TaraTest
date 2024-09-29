import { NextResponse } from "next/server";
import { AverageScore } from "./AverageScore";
import { fetchBaseData } from "@/app/utils/fetchBaseData";
import { TodoList } from "./TodoList";

type FetchResult = Awaited<ReturnType<typeof fetchBaseData>>;

function isValidData(data: FetchResult[number]): data is Exclude<FetchResult[number], NextResponse> {
    return !(data instanceof NextResponse) && data !== null;
}

export async function AverageScoreWrapper() {
    const result = await fetchBaseData();
    
    const validData = result.filter((d) => isValidData(d));
    
    return <AverageScore initialData={validData} />;
}

export async function TodoListWrapper() {
    const result = await fetchBaseData();
  
    
    const todaysData = result
    .filter((d) => isValidData(d))
    .find((d) => d.Date === new Date().toISOString().split("T")[0]);
    if (!todaysData) {
        return <div>No data for today</div>;
    }
    
    return <TodoList items={todaysData.items} />;
}