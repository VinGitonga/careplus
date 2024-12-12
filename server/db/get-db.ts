import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { remember } from "@epic-web/remember";

// const { db: envDB } = useRuntimeConfig();

const getDB = () => {
    const pool = postgres(process.env.NEW_DB_URL!);
    const db = remember("db-client", () => drizzle({ client: pool }));

    return db;
}

const pool = postgres(process.env.NEW_DB_URL!);

const db = remember("db-client", () => drizzle({ client: pool }));

export { db, getDB };
