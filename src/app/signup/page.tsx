"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created. You can now use the dashboard.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="panel w-full p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Create your secure account to save and manage leads.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input-base"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input-base"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-brand)]"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
