import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { sourceGroups, todayCards } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    const filePath = date
      ? path.join(process.cwd(), "data", "decks", `${date}.json`)
      : path.join(process.cwd(), "data", "daily-deck.json");
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return NextResponse.json({
      ...parsed,
      requestedDate: date ?? parsed.requestedDate ?? null,
    });
  } catch {
    return NextResponse.json({
      generatedAt: null,
      fallback: true,
      requestedDate: date ?? null,
      message: "Daily deck not found yet. Run `npm run crawl:day -- --date=YYYY-MM-DD` to populate stored deck data.",
      sources: sourceGroups,
      previewCards: todayCards.slice(0, 5),
    });
  }
}
