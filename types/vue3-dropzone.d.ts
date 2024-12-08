declare module "@jaxtheprime/vue3-dropzone" {
    import { DefineComponent, VNode } from "vue";

    interface ErrorEventProps {
        type: "file-too-large" | "invalid-file-format";
        files: File[];
    }

    interface Vue3DropzoneProps {
        modelValue?: Array<File>;
        multiple?: boolean;
        previews?: string;
        mode?: "drop" | "preview";
        accept?: string;
        maxFileSize?: number;
        maxFiles?: number;
        width?: string | number;
        height?: string | number;
        imgWidth?: string | number;
        imgHeight?: string | number;
        previewWrapperClasses?: string;
        previewPosition?: "inside" | "outside";
        showSelectButton?: boolean;
        selectFileStrategy?: "replace" | "merge";
        serverSide?: boolean;
        uploadEndpoint?: string;
        deleteEndpoint?: string;
        headers?: Record<string, any>;
    }

    // Change to an explicit type that matches Vue's emit pattern
    type Vue3DropzoneEmits = {
        'update:modelValue': [files: File[]];
        'error': [err: ErrorEventProps];
        'fileUploaded': [file: File];
        'fileRemoved': [file: File];
    }

    interface Vue3DropzoneSlots {
        default: () => VNode[];
        button?: (props: { fileInput: { click?: VoidFunction } }) => VNode;
        preview?: (props: {
            data: {
                file: File;
                id: string;
                src?: string;
                progress?: number;
                status?: "pending" | "uploading" | "success" | "error";
                message?: string;
            };
            formatSize: "B" | "KB" | "MB" | "GB";
            removeFile: VoidFunction;
        }) => VNode;
        description?: () => VNode;
        title?: () => VNode;
    }

    const Vue3Dropzone: DefineComponent<
        Vue3DropzoneProps, 
        {}, 
        Vue3DropzoneSlots, 
        Vue3DropzoneEmits
    >;

    export default Vue3Dropzone;
}