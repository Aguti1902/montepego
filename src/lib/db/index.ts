import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no está definida. Configura la conexión a Supabase.",
    );
  }

  if (!client) {
    client = postgres(connectionString, { prepare: false, max: 10 });
  }

  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof getDb>;
export { schema };
