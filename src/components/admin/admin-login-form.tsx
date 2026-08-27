"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("אימייל או סיסמה שגויים");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("שגיאה בהתחברות. נסו שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-white/10 bg-primary-light p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <SiteLogo imageClassName="h-14" />
          <h1 className="mt-6 text-2xl font-bold text-white">כניסה לניהול</h1>
          <p className="mt-2 text-sm text-white/70">{siteConfig.brandNameHe}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-white">
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/20 bg-black/40 text-white text-start"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              סיסמה
            </Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/20 bg-black/40 text-white text-start"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                מתחבר...
              </>
            ) : (
              "התחברות"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
