import Link from "next/link";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/properties", label: "Propiedades" },
  { href: "/admin/translations", label: "Traducciones" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/valuations", label: "Valoraciones" },
  { href: "/admin/content", label: "Contenido" },
  { href: "/admin/settings", label: "Ajustes" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-3 border-b border-border pb-4 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sea-deep hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
