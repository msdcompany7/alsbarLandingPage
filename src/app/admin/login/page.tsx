import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgb(255 106 0 / 0.25), transparent 42%), radial-gradient(circle at 80% 80%, rgb(255 255 255 / 0.06), transparent 35%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-[0.04]" aria-hidden />
      <Suspense fallback={<div className="relative z-10 text-white/70">טוען...</div>}>
        <AdminLoginForm />
      </Suspense>
    </section>
  );
}
