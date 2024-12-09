import { defineConfig } from "drizzle-kit";
import 'dotenv/config'

export default defineConfig({
	dialect: "postgresql",
	schema: "./server/schemas/**/*.schema{.ts,.js}",
	out: "./server/migrations",
	dbCredentials: {
		url: process.env.NEW_DB_URL!,
	},
});
