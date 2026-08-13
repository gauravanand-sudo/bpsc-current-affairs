import { redirect } from "next/navigation";

export default function HelpdeskPage() {
  redirect("/talk-to-us?intent=general");
}
