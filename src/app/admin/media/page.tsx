import { redirect } from "next/navigation";

export default function AdminMediaPage() {
  redirect("/admin/properties?issue=no-photos");
}
