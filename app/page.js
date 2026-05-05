import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/marketing/landing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return <LandingPage />;
}
