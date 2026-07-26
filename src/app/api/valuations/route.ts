import { NextResponse } from "next/server";
import { createValuation } from "@/lib/db/queries/valuations";
import { createLead } from "@/lib/db/queries/leads";
import { valuationSchema } from "@/lib/validators/valuations";
import { pushLeadToCrm } from "@/lib/crm/push-lead";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = valuationSchema.safeParse(body);

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
    const valuation = await createValuation({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      builtArea: data.builtArea,
      plotArea: data.plotArea,
      condition: data.condition || undefined,
    });

    const lead = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      locale: "en",
      message: `Valuation request: ${data.address}`,
      source: "valuation",
      preferences: {
        propertyType: data.propertyType,
        valuationId: valuation.id,
      },
    });

    const crmPush = await pushLeadToCrm(lead.id, {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      message: `Valuation request: ${data.address}`,
      locale: "en",
      source: "valuation",
    });

    return NextResponse.json(
      { id: valuation.id, status: valuation.status, crm: crmPush },
      { status: 201 },
    );
  } catch (error) {
    console.error("createValuation", error);
    return NextResponse.json(
      { error: "No se pudo guardar la valoración" },
      { status: 500 },
    );
  }
}
