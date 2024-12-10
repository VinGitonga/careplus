import { IApiResponseType } from "~/types/Api";
import type { H3Error } from "h3";

interface TCreateApiErr {
	statusCode?: number;
	apiErrorMsg?: string;
	errorMessage: string;
	data?: any;
}

export const createApiError = ({ statusCode = 400, apiErrorMsg = "Bad Request Exception", errorMessage, data = {} }: TCreateApiErr): Partial<H3Error<IApiResponseType>> => ({
	statusCode,
	message: apiErrorMsg,
	data: {
		status: "error",
		msg: errorMessage,
		errors: data,
	},
});
