"use client";

import { resetUserPassword } from "@/features/users/actions";
import { useActionState } from "react";

type UserPasswordFormProps = {
  userId: string;
};

const initialState = {
  ok: false,
  message: "",
};

export function UserPasswordForm({ userId }: UserPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetUserPassword,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="id" value={userId} />
      <label className="sr-only" htmlFor={`password-${userId}`}>
        Nueva contrasena
      </label>
      <div className="flex gap-2">
        <input
          id={`password-${userId}`}
          name="password"
          type="password"
          minLength={12}
          maxLength={128}
          placeholder="Nueva contrasena"
          className="min-h-10 w-44 rounded border border-zinc-300 px-2 text-xs outline-none focus:border-red-700"
        />
        <button
          disabled={isPending}
          className="rounded border border-zinc-300 px-2 text-xs font-black text-zinc-700 transition hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:text-zinc-400"
        >
          Reset
        </button>
      </div>
      {state.message ? (
        <p
          className={`text-xs font-semibold ${
            state.ok ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
