"use client";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/server/actions/auth";
import { buttonClass, underlineInput, underlineWrap } from "@/components/ui";

export function LoginForm() {
  // A stopped server or lost connection shows a message instead of crashing the page.
  const [state, action, pending] = useActionState<LoginState, FormData>(async (prev, formData) => {
    try {
      return await login(prev, formData);
    } catch (e) {
      if (e instanceof TypeError) return { username: String(formData.get("username") ?? ""), error: "Couldn't reach Groundwork. Check that the app is running, then try again." };
      throw e;
    }
  }, {});
  const [show, setShow] = useState(false);
  const fieldError = state.fieldErrors?.username ?? state.fieldErrors?.password;
  return (
    <form autoComplete="off" action={action} className="flex flex-col gap-[30px]" noValidate>
      <label className={underlineWrap}>
        <span className="label">Username</span>
        <input
          name="username"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          autoCapitalize="words"
          spellCheck={false}
          required
          defaultValue={state.username}
          placeholder="Enter your username"
          aria-invalid={!!state.fieldErrors?.username}
          className={underlineInput}
        />
      </label>
      <label className={underlineWrap}>
        <span className="label">Password</span>
        <span className="flex items-center">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            required
            placeholder="••••••••"
            aria-invalid={!!state.fieldErrors?.password}
            className={`${underlineInput} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-label={show ? "Hide password" : "Show password"}
            className="py-2 pl-3 font-mono text-[11px] text-ink-3 uppercase transition-colors hover:text-accent-text"
          >
            {show ? "Hide" : "Show"}
          </button>
        </span>
      </label>
      {(state.error || fieldError) && (
        <div role="alert" className="text-[13px] leading-[1.45] text-danger">
          {state.error ?? fieldError}
        </div>
      )}
      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className={buttonClass("accent", "xl")}>
          {pending ? "Signing in…" : "Sign in ↗"}
        </button>
      </div>
    </form>
  );
}
