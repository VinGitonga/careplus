import { Resend } from "resend";
import handlebars from "handlebars";

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

const resend = new Resend(useRuntimeConfig().resend.apiKey);

export const sendEmail = async (options: ISendEmailOptions) => {
	const templateItem = await useStorage("assets:server").getItem(`templates/emails/${options.template}.html`).then((val) => val?.toString())

	const compiledTemplate = handlebars.compile(templateItem);

	const emittedHtml = compiledTemplate(options.data);

	const response = await resend.emails.send({
		from: "CarePulse <support-carepulse@vingitonga.xyz>",
		to: options.to,
		subject: options.subject,
		html: emittedHtml,
	});

	return response;
};
