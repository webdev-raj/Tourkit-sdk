import { redirect } from "next/navigation"

export default function SignupRedirectPage() {
  redirect("/auth?mode=signup")
}
