import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// DEV_NOTE: A Worker cannot reuse a connection across requests, so a client is created per request
// (DALs are instantiated per request). Hyperdrive pools the actual connections to Neon.
// max: 5 stays under the Workers limit of 6 concurrent outbound connections.
// fetch_types: false skips postgres.js's type-introspection round trip; we use no custom array types.
export default function getDbClient(env: Env) {
  const client = postgres(env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });
  return drizzle({ client });
}

export type DbClient = ReturnType<typeof getDbClient>;
