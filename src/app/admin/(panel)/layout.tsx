import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/firebase/auth-server";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  return <AdminShell>{children}</AdminShell>;
}
