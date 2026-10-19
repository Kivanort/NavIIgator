import { NextRequest, NextResponse } from "next/server";
import { readJsonBody, RequestBodyError } from "@/lib/request-body";

function cleanName(raw: unknown): string {
  if (!raw || typeof raw !== "string") return "Гость";
  let name = raw.trim();
  if (name.length === 0) return "Гость";
  name = name.replace(/[^a-zA-Zа-яА-ЯёЁәіңғүұқөөә\s\-]/g, "");
  name = name.substring(0, 50);
  if (name.length === 0) return "Гость";
  return name;
}

function cleanAge(raw: unknown): number {
  const num = Number(raw);
  if (!Number.isFinite(num) || num < 1 || num > 120) return 25;
  return Math.round(num);
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonBody(request, 4096);
    const body = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};

    const name = cleanName(body.name);
    const age = cleanAge(body.age);

    return NextResponse.json({ name, age });
  } catch (error) {
    if (error instanceof RequestBodyError && error.status === 413) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }
    return NextResponse.json({ name: "Гость", age: 25 });
  }
}
