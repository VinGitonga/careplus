export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const generateOptions = (options: string[], capitalizeText = false) => {
	return options.map((option) => {
		return { label: capitalizeText ? capitalize(option) : option, value: option };
	});
};

export const phoneNoRegex = /^0[17]\d{8}$/;
