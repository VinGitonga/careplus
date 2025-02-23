import { Buffer } from "buffer";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";

export default function useFirebaseAdmin() {
	let app: App | undefined = undefined;

	if (getApps().length === 0) {
		const decodedServiceAccount = Buffer.from(useRuntimeConfig().firebase.adminServiceAccountBase64, "base64").toString("utf-8");
		const serviceAccount = JSON.parse(decodedServiceAccount);

		console.log('serviceAccount.project_id', serviceAccount.project_id);

		app = initializeApp({
			credential: cert(serviceAccount),
			databaseURL: `${serviceAccount.project_id}.firebaseio.com`,
			storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
		});
	}

	return {
		app,
	};
}
