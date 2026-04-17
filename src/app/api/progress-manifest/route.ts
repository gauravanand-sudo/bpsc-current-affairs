import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type Manifest = Record<string, { cardCount: number }>;

export async function GET() {
  const root = path.join(process.cwd(), "data", "ca");
  const manifest: Manifest = {};

  try {
    const months = await fs.readdir(root);

    await Promise.all(
      months.map(async (month) => {
        const monthDir = path.join(root, month);
        const files = await fs.readdir(monthDir);

        await Promise.all(
          files
            .filter((file) => file.endsWith(".json") && !file.includes("-quiz-"))
            .map(async (file) => {
              const filePath = path.join(monthDir, file);
              const raw = await fs.readFile(filePath, "utf8");
              const parsed = JSON.parse(raw);
              const cardCount = Array.isArray(parsed) ? parsed.length : 0;
              const setName = file.replace(/\.json$/, "");
              manifest[`${month}:${setName}`] = { cardCount };
            })
        );
      })
    );

    return NextResponse.json(manifest);
  } catch {
    return NextResponse.json({});
  }
}
