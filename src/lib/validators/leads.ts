import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  phone: z.string().trim().max(40).optional(),
  locale: z.enum(["en", "nl", "de", "fr", "pl", "es"]),
  message: z.string().trim().max(4000).optional(),
  propertyId: z.string().uuid().optional(),
  propertyReference: z.string().trim().max(32).optional(),
  source: z
    .enum(["form", "whatsapp", "valuation", "property_alert", "portal"])
    .optional()
    .default("form"),
  budgetMin: z.coerce.number().int().positive().optional(),
  budgetMax: z.coerce.number().int().positive().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
