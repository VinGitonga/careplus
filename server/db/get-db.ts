import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { remember } from "@epic-web/remember";

const { db: envDB } = useRuntimeConfig();

const pool = postgres(envDB.url);

const db = remember("db-client", () => drizzle({ client: pool }));

export { db };
