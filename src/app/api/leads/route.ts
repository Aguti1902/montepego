import { NextResponse } from "next/server";
import { createLead } from "@/lib/db/queries/leads";
import { leadSchema } from "@/lib/validators/leads";

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

    return NextResponse.json({ id: lead.id, status: lead.status }, { status: 201 });
  } catch (error) {
    console.error("createLead", error);
    return NextResponse.json(
      { error: "No se pudo guardar el lead" },
      { status: 500 },
    );
  }
}
