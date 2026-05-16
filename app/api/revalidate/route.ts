import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

type Body = {
  path?: string;
  secret?: string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.path || typeof body.path !== "string") {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  revalidatePath(body.path);
  return NextResponse.json({ revalidated: true, path: body.path });
}
