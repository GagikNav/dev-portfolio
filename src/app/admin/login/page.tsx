import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-fg mb-2">
            Admin
            <span className="text-accent" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="text-sm text-fg-muted">
            Sign in to manage your portfolio
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
