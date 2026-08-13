import Link from "next/link";
import QuizEngine from "@/components/QuizEngine";
import { getPyqQuiz, PYQ_QUIZZES } from "@/lib/quizBank";

export function generateStaticParams() {
  return PYQ_QUIZZES.map((quiz) => ({ set: quiz.slug }));
}

export default async function PyqPatternQuizPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set } = await params;
  const quiz = getPyqQuiz(set);

  if (!quiz) {
    return (
      <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Quiz not found</h1>
          <Link href="/quizzes/pyq">Return to PYQ Practice →</Link>
        </div>
      </main>
    );
  }

  return (
    <QuizEngine
      data={quiz}
      month="pyq-patterns"
      setName={set}
      libraryHref="/quizzes/pyq"
      libraryLabel="All PYQ-Pattern Tests"
      studyHref="/pyq"
      studyLabel="Open PYQ Desk →"
    />
  );
}
