import { NextResponse } from "next/server";
import { runCrmSync } from "@/lib/crm/sync";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await runCrmSync();
  const status = result.status === "failed" ? 500 : 200;
  return NextResponse.json(result, { status });
}

export async function POST(request: Request) {
  return GET(request);
}
