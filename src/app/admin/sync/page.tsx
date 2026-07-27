import { redirect } from "next/navigation";

export default function AdminSyncPage() {
  redirect("/admin/settings#sincronizacion");
}
