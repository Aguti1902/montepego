import { z } from "zod";

export const valuationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(240),
  propertyType: z.enum([
    "villa",
    "apartment",
    "plot",
    "townhouse",
    "commercial",
  ]),
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  builtArea: z.coerce.number().int().positive().optional(),
  plotArea: z.coerce.number().int().positive().optional(),
  condition: z.string().trim().max(120).optional().or(z.literal("")),
});

export type ValuationFormValues = z.infer<typeof valuationSchema>;
