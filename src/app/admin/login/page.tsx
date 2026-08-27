import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-screen items-center bg-primary px-4 py-16">
      <Suspense fallback={<div className="mx-auto text-white/70">טוען...</div>}>
        <AdminLoginForm />
      </Suspense>
    </section>
  );
}
