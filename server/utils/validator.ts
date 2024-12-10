import { ZodError, ZodSchema } from "zod";
import { ApiResponseType } from "~/types/Api";

class Validator {
	validateSchema(schema: ZodSchema, data: any): void {
		try {
			schema.parse(data);
		} catch (err) {
			let errorItem = err as ZodError;
			const errorObj = {} as any;
			for (const error of errorItem.issues) {
				if (error.path.length === 1) {
					errorObj[error.path[0]] = error.message;
				}

				if (error.path.length === 2) {
					errorObj[error.path[1]] = error;
				}

				if (error.path.length === 3) {
					errorObj[error.path[1] + "." + error.path[2]] = error;
				}
			}

			throw createError<ApiResponseType>({
				statusCode: 400,
				message: "Validation Error",
				data: {
					status: "error",
					data: errorObj,
					msg: "Validation Error",
				},
			});
		}
	}
}

export default new Validator();
