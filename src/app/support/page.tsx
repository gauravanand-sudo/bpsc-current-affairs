import { redirect } from "next/navigation";

export default function SupportPage() {
  redirect("/ask?intent=general");
}
