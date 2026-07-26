import { NextResponse } from "next/server";
import { z } from "zod";
import { getPropertyBySlug } from "@/lib/db/queries/properties";
import { listLeads } from "@/lib/db/queries/leads";
import { sendTransactionalEmail } from "@/lib/email/client";
import { propertyAlertEmail } from "@/lib/email/templates";
import { formatPrice } from "@/lib/utils";

const bodySchema = z.object({
  slug: z.string().min(1),
});

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get("authorization");
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  }

  const property = await getPropertyBySlug(parsed.data.slug, "en");
  if (!property) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://montepegolife.com";
  const leads = await listLeads();
  let sent = 0;

  for (const lead of leads) {
    const budgetOk =
      lead.budgetMax == null || property.price <= lead.budgetMax;
    if (!budgetOk) continue;

    const template = propertyAlertEmail({
      name: lead.name,
      title: property.title,
      reference: property.reference,
      url: `${siteUrl}/en/property/${property.slug}`,
      priceLabel: formatPrice(property.price, lead.locale),
    });

    await sendTransactionalEmail({
      to: lead.email,
      subject: template.subject,
      html: template.html,
    });
    sent += 1;
  }

  return NextResponse.json({ sent, propertyReference: property.reference });
}
