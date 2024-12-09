import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const { db } = useRuntimeConfig();

export default async function getDB() {
	const client = postgres(db.url);

	const connectedDb = drizzle({ client });

	return connectedDb;
}
