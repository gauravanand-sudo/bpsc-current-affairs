import { redirect } from "next/navigation";

export default function HelpdeskPage() {
  redirect("/ask?intent=general");
}
