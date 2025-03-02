import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const baseSchema = {
	id: uuid("id").defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
		.defaultNow()
		.$onUpdate(() => sql`current_timestamp`),
};
