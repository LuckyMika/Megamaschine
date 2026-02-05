import type { BASE_PREFIXES, Token, TokenType } from "./types";

function isLetter(input: string): boolean {
	if (input.length != 1) return false;

	return input == "_"
		|| (input.charCodeAt(0) >= "A".charCodeAt(0) && input.charCodeAt(0) <= "Z".charCodeAt(0))
		|| (input.charCodeAt(0) >= "a".charCodeAt(0) && input.charCodeAt(0) <= "z".charCodeAt(0));
}

function isNumber(input: string, base: number = 10): boolean {
	if (input.length != 1) return false;

	return !isNaN(parseInt(input, base))
}

function stringToBase(input: typeof BASE_PREFIXES[number]) {
	if (input == "$" || input == "") return 10;
	if (input == "#") return 16;
	if (input == "b") return 2;
	throw new Error(`Invalid base character ${input}`);
}

function isEnumKey<
	E extends Record<string, string | number>>(
		e: E,
		key: string
	): key is Extract<keyof E, string> {
	return key in e
}

export { isLetter, isNumber, isEnumKey, stringToBase }
