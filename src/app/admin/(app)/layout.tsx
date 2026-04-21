import { requireAuth } from "@/lib/auth";
import { logoutAction } from "../actions";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s — Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <header className="border-b border-border bg-bg sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-fg">
            Admin
            <span className="text-accent" aria-hidden="true">
              .
            </span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
