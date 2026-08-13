import { notFound, redirect } from "next/navigation";

const YEARS = Array.from({ length: 13 }, (_, index) => 2026 - index);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export default async function UpscPrelimsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: rawYear } = await params;
  const year = Number(rawYear);

  if (!YEARS.includes(year)) notFound();

  redirect(`/pyq/upsc/prelims/${year}.pdf`);
}
