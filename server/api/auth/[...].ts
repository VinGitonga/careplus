import { NuxtAuthHandler } from "#auth";
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db/get-db";
import { usersTable } from "~/server/schemas/user.schema";

export default NuxtAuthHandler({
	secret: useRuntimeConfig().auth.secret,
	pages: {
		signIn: "/auth/login",
	},
	providers: [
		// @ts-expect-error
		CredentialsProvider.default({
			name: "credentials",
			origin: useRuntimeConfig().auth.origin,
			async authorize(credentials: { email: string; phoneNo: string; otp: string }) {
				const user = await db.select().from(usersTable).where(eq(usersTable.email, credentials.email)).limit(1);

				if (!user?.[0]) {
					throw new Error("Invalid email or otp");
				}

				const isOTPValid = user?.[0].otp === credentials.otp;

				if (!isOTPValid) {
					throw new Error("Invalid email or otp");
				}

				// nullify the otp and return user obj
				await db.update(usersTable).set({ otp: null }).where(eq(usersTable.id, user?.[0].id));
				const updatedUser = await db.select().from(usersTable).where(eq(usersTable.email, credentials.email)).limit(1);

				return updatedUser?.[0];
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token = {
					...token,
					...user,
				};
			}

			return token;
		},
		async session({ session, token }) {
			session.user = {
				...session.user,
				...token,
			};

			return session;
		},
	},
});
