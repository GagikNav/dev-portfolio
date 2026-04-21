"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Password is required." };
  }

  const valid = await verifyPassword(password);

  if (!valid) {
    return { error: "Incorrect password." };
  }

  await createSession();
  redirect("/admin");
}
