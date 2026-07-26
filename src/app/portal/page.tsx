import Link from "next/link";

export default function PortalHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Acceso al portal</h1>
      <p className="text-muted-foreground">
        Elige tu espacio. En producción el acceso se hace con la cuenta
        Supabase del rol correspondiente.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/portal/owner"
          className="border border-border bg-card p-5 hover:border-sea-deep"
        >
          <h2 className="font-display text-xl">Portal del propietario</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estado de tu vivienda en venta, consultas e interés.
          </p>
        </Link>
        <Link
          href="/portal/resident"
          className="border border-border bg-card p-5 hover:border-sea-deep"
        >
          <h2 className="font-display text-xl">Portal del residente</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Paquetería, incidencias y reservas en La Cova.
          </p>
        </Link>
      </div>
    </div>
  );
}
