import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	return {
		status: "success",
		msg: "Hello World",
	};
});
