export interface UseDisclosureProps {
	isOpen?: boolean;
	defaultOpen?: boolean;
	onClose?(): void;
	onOpen?(): void;
}

export function useDisclosure(props: UseDisclosureProps = {}) {
	const { defaultOpen, isOpen: isOpenProp, onClose: onCloseProp, onOpen: onOpenProp } = props;

	const isOpen = ref<boolean>(isOpenProp ?? defaultOpen ?? false);

	const isControlled = isOpenProp !== undefined;

	const onClose = () => {
		if (!isControlled) {
			isOpen.value = false;
		}
		onCloseProp && onCloseProp?.();
	};

	const onOpen = () => {
		if (!isControlled) {
			isOpen.value = true;
		}
		onOpenProp && onOpenProp?.();
	};

	const onOpenChange = () => {
		const action = isOpen.value ? onClose : onOpen;

		action();
	};

	return {
		isOpen,
		onOpen,
		onClose,
		onOpenChange,
		isControlled,
	};
}
