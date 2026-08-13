import Link from "next/link";
import QuizEngine from "@/components/QuizEngine";
import { getStaticQuiz, STATIC_QUIZZES } from "@/lib/quizBank";

export function generateStaticParams() {
  return STATIC_QUIZZES.map((quiz) => ({ subject: quiz.slug }));
}

export default async function StaticSubjectQuizPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const quiz = getStaticQuiz(subject);

  if (!quiz) {
    return (
      <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Quiz not found</h1>
          <Link href="/quizzes/static">Return to Static GS →</Link>
        </div>
      </main>
    );
  }

  return (
    <QuizEngine
      data={quiz}
      month="static-gs"
      setName={subject}
      libraryHref="/quizzes/static"
      libraryLabel="All Static GS Tests"
      studyHref="/study"
      studyLabel="Open Free Study →"
    />
  );
}
