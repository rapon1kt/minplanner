import { expireTasksService } from "@/services/task";
import { NextRequest, NextResponse } from "next/server";

async function expireTasks(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { success: false, message: "Missing CRON_SECRET." },
      { status: 500 },
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const result = await expireTasksService();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Internal server error while expiring tasks: ", error);
    return NextResponse.json(
      { success: false, message: "It was not possible to expire tasks." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return expireTasks(request);
}

export async function POST(request: NextRequest) {
  return expireTasks(request);
}
