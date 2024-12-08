import type { Updater } from "@tanstack/vue-table";

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const generateOptions = (options: string[], capitalizeText = false) => {
	return options.map((option) => {
		return { label: capitalizeText ? capitalize(option) : option, value: option };
	});
};

export const phoneNoRegex = /^0[17]\d{8}$/;

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
	ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
}

export function getInitials(name: string) {
	const splitName = name.trim().split(" ");

	if (splitName.length === 1) {
		return splitName[0][0].toUpperCase();
	} else {
		return (splitName[0][0] + splitName[splitName.length - 1][0]).toUpperCase();
	}
}
