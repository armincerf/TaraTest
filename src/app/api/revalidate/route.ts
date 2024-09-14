import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
	const secret = request.nextUrl.searchParams.get("secret");

	if (secret !== process.env.REVALIDATION_SECRET) {
		return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
	}

	const path = request.nextUrl.searchParams.get("path") || "/";

	revalidatePath(path);

	return NextResponse.json({ revalidated: true, now: Date.now() });
}
