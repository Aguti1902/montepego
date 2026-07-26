import { memoryPortal } from "@/lib/db/portal-memory";
import { createReservationAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ResidentPortalPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Portal del residente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Paquetería, incidencias y reservas en La Cova.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Paquetería</h2>
        {memoryPortal.parcels.map((parcel) => (
          <article key={parcel.id} className="border border-border bg-card p-4">
            <p className="font-medium">{parcel.carrier}</p>
            <p className="text-sm tabular text-muted-foreground">
              {parcel.trackingCode}
            </p>
            <p className="mt-1 text-sm">{parcel.description}</p>
            <p className="mt-2 text-xs uppercase tracking-wide">{parcel.status}</p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Incidencias</h2>
        {memoryPortal.incidents.map((incident) => (
          <article
            key={incident.id}
            className="border border-border bg-card p-4"
          >
            <p className="font-medium">{incident.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {incident.description}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide">
              {incident.status}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Reservar en La Cova</h2>
        <form
          action={createReservationAction}
          className="space-y-3 border border-border bg-card p-4"
        >
          <div className="space-y-2">
            <Label htmlFor="reservedFor">Fecha y hora</Label>
            <Input
              id="reservedFor"
              name="reservedFor"
              type="datetime-local"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partySize">Comensales</Label>
            <Input
              id="partySize"
              name="partySize"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" name="notes" />
          </div>
          <Button type="submit">Pedir reserva</Button>
        </form>
        {memoryPortal.reservations.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {memoryPortal.reservations.map((reservation) => (
              <li key={reservation.id} className="border border-border p-3">
                {new Date(reservation.reservedFor).toLocaleString("es-ES")} ·{" "}
                {reservation.partySize} personas · {reservation.status}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
