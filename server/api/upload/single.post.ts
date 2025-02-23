import { nanoid } from "nanoid";
import useFirebaseAdmin from "~/composables/useFirebaseAdmin";
import { getStorage } from "firebase-admin/storage";

export default defineEventHandler(async (event) => {
	const formData = await readFormData(event);
	const file = formData.get("file") as File;
	const folder = formData.get("folder") as string;

	const { app } = useFirebaseAdmin();

	if (!file) {
		return {
			status: "error",
			msg: "No file found.",
		};
	}

	const fileNameWithoutExt = file?.name?.split(".")?.slice(0, -1)?.join(".");
	const fileExt = file.name.split(".").pop();
	const unique_file_name = `${fileNameWithoutExt}_${nanoid()}_.${fileExt}`;

	try {
		const documentRef = getStorage(app)
			.bucket()
			.file(folder ? `${folder}/${unique_file_name}` : `documents/${unique_file_name}`);

		const contentType = file.type || `application/${file.name.split(".").pop()}`;
		const fileBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
		await documentRef.save(new Uint8Array(fileBuffer), { contentType });

		const [url] = await documentRef.getSignedUrl({
			version: "v2",
			action: "read",
			expires: 253402300799000,
		});

		return {
			status: "success",
			msg: "File Upload successfully.",
			data: {
				url,
			},
		};
	} catch (err) {
		console.error("Error uploading file", err);
		setResponseStatus(event, 400, "Bad Request");
		return {
			status: "error",
			msg: "Error uploading file.",
		};
	}
});
