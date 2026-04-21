"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

const initialState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-fg-muted mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-fg placeholder-fg-subtle text-sm focus:outline-2 focus:outline-offset-2 focus:outline-accent"
          placeholder="Enter admin password"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-accent text-bg rounded-lg text-sm font-medium hover:bg-accent-hi transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
