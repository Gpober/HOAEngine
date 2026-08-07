"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export interface LoginState {
  status: "idle" | "error";
  message?: string;
}

export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/leads");

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { status: "error", message: "Sign-in is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague: distinguishing "no such account" from "wrong
    // password" tells an attacker which addresses are registered.
    return { status: "error", message: "That email and password did not match." };
  }

  // Only ever redirect within this site — an open redirect here would let a
  // crafted link bounce a freshly authenticated admin somewhere hostile.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin/leads");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/login");
}
