export interface UseDropzoneOptions {
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	maxFiles?: number;
	disabled?: boolean;
	onDrop?: (acceptedFiles: File[], rejectedFiles: File[]) => void;
	onDropAccepted?: (files: File[]) => void;
	onDropRejected?: (files: File[]) => void;
}

export interface UseDropzoneState {
	isDragActive: boolean;
	isDragAccept: boolean;
	isDragReject: boolean;
	acceptedFiles: File[];
	rejectedFiles: File[];
}

export interface UseDropzoneInputProps {
	accept?: string;
	multiple?: boolean;
	disabled?: boolean;
}

export interface FileRejection {
	file: File;
	errors: Array<{ code: string; message: string }>;
}
