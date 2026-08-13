import { redirect } from "next/navigation";

export default function SupportPage() {
  redirect("/talk-to-us?intent=general");
}
