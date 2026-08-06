import { redirect } from "next/navigation";

/**
 * The portfolio at `/demo` is the entry point for this project, so the root
 * simply forwards there.
 */
export default function HomePage() {
  redirect("/demo");
}
