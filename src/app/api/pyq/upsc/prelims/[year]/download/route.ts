import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const YEARS = new Set(Array.from({ length: 13 }, (_, index) => 2026 - index));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  const { year: rawYear } = await params;
  const year = Number(rawYear);

  if (!YEARS.has(year)) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "pyq",
      "upsc",
      "prelims",
      `${year}.pdf`,
    );
    const file = await readFile(filePath);

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="UPSC-Prelims-GS-I-${year}.pdf"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }
}
