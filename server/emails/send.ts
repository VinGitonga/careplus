import { Resend } from "resend";
import * as path from "path";
import * as fs from "fs";
import { compile } from "handlebars";

export enum EmailTemplate {
	WELCOME = "welcome",
	OTP = "otp",
}

interface ISendEmailOptions {
	to: string[];
	subject: string;
	template: EmailTemplate;
	data?: Record<string, any>;
}

const templatesPath = path.join(__dirname, "../templates/emails");

const resend = new Resend(useRuntimeConfig().resend.apiKey);

export const sendEmail = async (options: ISendEmailOptions) => {
	const templateString = fs.readFileSync(path.join(templatesPath, `${options.template}.html`), "utf-8");

	const compiledTemplate = compile(templateString);

	const emittedHtml = compiledTemplate(options.data);

	const response = await resend.emails.send({
		from: "CarePulse <support-carepulse@vingitonga.xyz>",
		to: options.to,
		subject: options.subject,
		html: emittedHtml,
	});

	return response;
};
