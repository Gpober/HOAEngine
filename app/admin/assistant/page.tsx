import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ASSISTANT_NAME } from "@/lib/assistant/config";
import { site } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase-server";
import { AdminHeader } from "../AdminHeader";
import { AssistantChat } from "./AssistantChat";

export const metadata: Metadata = {
  title: `${ASSISTANT_NAME} — ${site.name}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const supabase = await createServerSupabase();
  const { data: isAdmin } = supabase
    ? await supabase.rpc("is_admin")
    : { data: false };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminHeader
        title={ASSISTANT_NAME}
        subtitle="Your chief of staff — enquiries, concepts, and what's getting attention"
      />

      <main className="flex min-h-0 flex-1 flex-col">
        {isAdmin ? (
          <AssistantChat />
        ) : (
          <Container className="py-10">
            <Card className="p-6">
              <p className="font-semibold text-ink">
                {ASSISTANT_NAME} is admin-only.
              </p>
              <p className="mt-2 text-base text-ink-soft">
                This account isn’t on the admin list, so the assistant — and the
                enquiry data it reads — stays closed.
              </p>
            </Card>
          </Container>
        )}
      </main>
    </div>
  );
}
