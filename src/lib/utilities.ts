function isLetter(input: string): boolean {
	if (input.length != 1) return false;

	return input == "_"
		|| (input.charCodeAt(0) >= "A".charCodeAt(0) && input.charCodeAt(0) <= "Z".charCodeAt(0))
		|| (input.charCodeAt(0) >= "a".charCodeAt(0) && input.charCodeAt(0) <= "z".charCodeAt(0));
}

function isNumber(input: string): boolean {
	if (input.length != 1) return false;

	return input.charCodeAt(0) >= "0".charCodeAt(0) && input.charCodeAt(0) <= "9".charCodeAt(0);
}


function isEnumKey<
	E extends Record<string, string | number>>(
		e: E,
		key: string
	): key is Extract<keyof E, string> {
	return key in e
}

export { isLetter, isNumber, isEnumKey }
