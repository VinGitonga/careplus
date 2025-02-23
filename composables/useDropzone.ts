import { computed, ref, type Ref } from "vue";
import type { UseDropzoneInputProps, UseDropzoneOptions, UseDropzoneState } from "~/types/UseDropzone";

/**
 * Simple Drag n Drop Composable hook for all your needs, customizable API
 * @param options 
 * @example
 * ```vue
 * <template>
  <div
    v-bind="getRootProps()"
    class="w-full p-8 border-2 border-dashed rounded-lg"
    :class="{
      'border-blue-500 bg-blue-50': isDragActive,
      'border-gray-300': !isDragActive
    }"
  >
    <input v-bind="getInputProps()" class="hidden" />
    
    <div class="text-center">
      <p class="text-lg">
        {{ isDragActive ? 'Drop files here...' : 'Drag & drop files here' }}
      </p>
      <p class="text-sm text-gray-500">or click to select</p>
    </div>

    <!-- Accepted Files -->
    <div v-if="acceptedFiles.length > 0" class="mt-4 space-y-2">
      <div
        v-for="file in acceptedFiles"
        :key="file.name"
        class="flex items-center p-2 bg-gray-50 rounded"
      >
        <span class="flex-1">{{ file.name }}</span>
        <button @click.stop="removeFile(file)" class="text-red-500">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDropzone } from './composables/useDropzone';
import { useFileValidation } from './composables/useFileValidation';

const {
  isDragActive,
  acceptedFiles,
  getRootProps,
  getInputProps,
  removeFile
} = useDropzone({
  accept: '.jpg,.png,.pdf',
  multiple: true,
  maxSize: 5 * 1024 * 1024, // 5MB
  onDrop: (accepted, rejected) => {
    console.log('Accepted:', accepted);
    console.log('Rejected:', rejected);
  }
});

const { formatFileSize } = useFileValidation();
</script>
 * ```
 * @returns 
 */
const useDropzone = (options: UseDropzoneOptions = {}) => {
	const { accept = "", multiple = false, maxSize = Infinity, maxFiles = Infinity, disabled = false, onDrop, onDropAccepted, onDropRejected } = options;

	const state = ref<UseDropzoneState>({ isDragActive: false, isDragAccept: false, isDragReject: false, acceptedFiles: [], rejectedFiles: [] });

	const inputRef: Ref<HTMLInputElement | null> = ref(null);
	const rootRef: Ref<HTMLElement | null> = ref(null);

	const acceptedFileTypes = computed(() => {
		return accept.split(",").map((type) => type.trim());
	});

	const validateFile = (file: File) => {
		const errors = [];
		if (accept) {
			const fileType = file.type || `application/${file.name.split(".").pop()}`;
			const isValidType = acceptedFileTypes.value.some((type) => {
				if (type.startsWith(".")) {
					return file.name.toLowerCase().endsWith(type.toLowerCase());
				}
				return fileType.match(new RegExp(type.replace("*", ".*")));
			});

			if (!isValidType) {
				errors.push({ code: "file-invalid-type", message: "File type not accepted" });
			}
		}

		if (file.size > maxSize) {
			errors.push({ code: "file-too-large", message: `File is larger than ${maxSize} bytes` });
		}

		return errors;
	};

	const handleFiles = (files: FileList | null) => {
		if (!files) return;

		const accepted: File[] = [];
		const rejected: File[] = [];

		Array.from(files).forEach((file) => {
			const errors = validateFile(file);
			if (errors.length === 0 && (multiple || accepted.length === 0)) {
				accepted.push(file);
			} else {
				rejected.push(file);
			}
		});

		// Handle maxFiles limit
		if (maxFiles < Infinity) {
			const remainingSlots = maxFiles - state.value.acceptedFiles.length;
			accepted.splice(remainingSlots);
		}

		if (accepted.length) {
			state.value.acceptedFiles = multiple ? [...state.value.acceptedFiles, ...accepted] : accepted;
			onDropAccepted?.(accepted);
		}

		if (rejected.length) {
			state.value.rejectedFiles = rejected;
			onDropRejected?.(rejected);
		}

		onDrop?.(accepted, rejected);
	};

	const getInputProps = (props: UseDropzoneInputProps = {}): Record<string, any> => ({
		accept: props.accept ?? accept,
		multiple: props.multiple ?? multiple,
		disabled: props.disabled ?? disabled,
		onChange: (event: Event) => {
			const target = event.target as HTMLInputElement;
			handleFiles(target.files);
			// reset input value
			target.value = "";
		},
		ref: inputRef,
	});

	const getRootProps = () => ({
		ref: rootRef,
		onDragenter: (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			state.value.isDragActive = true;
		},
		onDragleave: (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			state.value.isDragActive = false;
		},
		onDragover: (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
		},
		onDrop: (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			state.value.isDragActive = false;
			handleFiles(e.dataTransfer?.files || null);
		},
		onClick: (e: MouseEvent) => {
			
			e.stopPropagation();
			if (!disabled && inputRef.value) {
				inputRef.value.click();
			}
		},
	});

	const removeFile = (fileToRemove: File) => {
		state.value.acceptedFiles = state.value.acceptedFiles.filter((file) => file !== fileToRemove);
	};

	const removeAll = () => {
		state.value.acceptedFiles = [];
		state.value.rejectedFiles = [];
	};

	return { ...state.value, getInputProps, getRootProps, removeFile, removeAll, inputRef, rootRef };
};

export default useDropzone;
