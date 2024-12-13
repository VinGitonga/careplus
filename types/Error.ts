import { FetchError } from "ofetch";
import type { IApiErrorResponse } from "./Api";

export type TApiError = {
	data: FetchError<IApiErrorResponse>;
	message: string;
	stack: string;
	statusCode: number;
	statusMessage: string;
	url: string;
};
