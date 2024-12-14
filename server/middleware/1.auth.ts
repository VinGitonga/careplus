import UrlPattern from "url-pattern";
import { getServerSession } from "#auth";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event) => {
	const nonProtectedRoutes = ["/api", "/api/auth/*", "/api/users", "/api/users/otp/request", "/api/users/save-admin"];

	const isApiRoute = event.node.req.url!.startsWith("/api");

	if (!isApiRoute) {
		return;
	}

	const isNonProtectedRoute = nonProtectedRoutes.some((route) => {
		const pattern = new UrlPattern(route);
		return pattern.match(event.node.req.url!);
	});

	if (isNonProtectedRoute) return;

	const session = await getServerSession(event);

	if (!session?.user) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "You're not authorized to access this resource", statusCode: 401, apiErrorMsg: "Unauthorized" }));
	}

	event.context.user = session?.user;
});
