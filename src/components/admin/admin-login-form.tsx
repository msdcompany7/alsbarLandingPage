"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { siteConfig } from "@/lib/site-config";
import { getFirebaseAuth } from "@/lib/firebase/client";
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
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken(true);

      const response = await fetch("/api/admin/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await auth.signOut();
        if (response.status === 403) {
          setError("המשתמש אינו מורשה לגשת לניהול");
          return;
        }
        if (response.status === 429) {
          setError("יותר מדי ניסיונות התחברות. נסו שוב בעוד מספר דקות");
          return;
        }
        setError("שגיאה ביצירת ההתחברות. בדקו את הגדרות Firebase Admin ב-.env");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";

      if (code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError("מפתח Firebase API לא תקין. עדכנו את NEXT_PUBLIC_FIREBASE_API_KEY מ-Firebase Console");
      } else if (code === "auth/operation-not-allowed") {
        setError("התחברות באימייל/סיסמה לא מופעלת ב-Firebase Authentication");
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found" ||
        code === "auth/invalid-email"
      ) {
        setError("אימייל או סיסמה שגויים");
      } else {
        setError("אימייל או סיסמה שגויים");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-white/[0.03] px-8 py-8 text-center">
          <SiteLogo priority framed className="justify-center" />
          <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">כניסה לניהול</h1>
          <p className="mt-2 text-sm text-white/65">{siteConfig.brandNameHe}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-8 py-8">
          <div>
            <Label htmlFor="email" className="text-white/90">
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 border-white/15 bg-black/30 text-white text-start placeholder:text-white/35"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white/90">
              סיסמה
            </Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 border-white/15 bg-black/30 text-white text-start placeholder:text-white/35"
              required
            />
          </div>

          {error && <AdminAlert variant="error">{error}</AdminAlert>}

          <Button type="submit" variant="primary" className="w-full rounded-xl" disabled={loading}>
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
