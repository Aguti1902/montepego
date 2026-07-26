import { NextResponse } from "next/server";
import { createLead } from "@/lib/db/queries/leads";
import { leadSchema } from "@/lib/validators/leads";
import { sendTransactionalEmail } from "@/lib/email/client";
import { leadConfirmationEmail } from "@/lib/email/templates";
import { pushLeadToCrm } from "@/lib/crm/push-lead";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos no válidos",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const lead = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      locale: data.locale,
      message: data.message || undefined,
      source: data.source,
      propertyId: data.propertyId,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
    });

    const email = leadConfirmationEmail(data.name);
    await sendTransactionalEmail({
      to: data.email,
      subject: email.subject,
      html: email.html,
    });

    const crmPush = await pushLeadToCrm(lead.id, {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      message: data.message || undefined,
      locale: data.locale,
      source: data.source,
      propertyCrmId: data.propertyReference,
    });

    return NextResponse.json(
      {
        id: lead.id,
        status: lead.status,
        crm: crmPush,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("createLead", error);
    return NextResponse.json(
      { error: "No se pudo guardar el lead" },
      { status: 500 },
    );
  }
}
