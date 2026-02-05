import { BASE_PREFIXES, TokenType, type Token } from "./types";
import { isLetter, isNumber, stringToBase } from "./utilities";

function lex(input: string): Token[] {
	const tokens: Token[] = [];
	let index = 0;

	while (index < input.length) {
		if (isLetter(input.charAt(index))) {
			let buffer = input.charAt(index);

			index++;

			while (isLetter(input.charAt(index)) || isNumber(input.charAt(index))) {
				buffer += input.charAt(index);
				index++;
			}

			tokens.push({ type: TokenType.IDENTIFIER, value: buffer });
		} else if (isNumber(input.charAt(index))) {
			let buffer = input.charAt(index);

			index++;

			while (isNumber(input.charAt(index))) {
				buffer += input.charAt(index);
				index++;
			}

			if (isLetter(input.charAt(index))) {
				while (isLetter(input.charAt(index)) || isNumber(input.charAt(index))) {
					buffer += input.charAt(index);
					index++;
				}

				tokens.push({ type: TokenType.IDENTIFIER, value: buffer })
			} else {
				tokens.push({ type: TokenType.LITERAL, value: buffer })
			}
		} else if (input.charAt(index) == "*") {
			tokens.push({ type: TokenType.DEREF, value: "*" });
			index++;
		} else if (input.charAt(index) == ",") {
			tokens.push({ type: TokenType.COMMA, value: "," });
			index++;
		} else if (input.charAt(index) == ":") {
			tokens.push({ type: TokenType.COLON, value: ":" });
			index++;
		} else if (input.charAt(index) == ";") {
			index++;

			let comment = input.charAt(index);

			index++;

			while (input.charAt(index) != "\n" && index < input.length) {
				comment += input.charAt(index);
				index++;
			}

			tokens.push({ type: TokenType.COMMENT, value: comment });
		} else if (BASE_PREFIXES.includes(input.charAt(index) as typeof BASE_PREFIXES[number])) {
			const base = input.charAt(index) as typeof BASE_PREFIXES[number];
			tokens.push({ type: TokenType.BASE, value: base });
			index++;

			let buffer = "";
			while (isNumber(input.charAt(index), stringToBase(base))) {
				buffer += input.charAt(index);
				index++;
			}

			tokens.push({ type: TokenType.LITERAL, value: buffer })
		} else if (input.charAt(index) == "\n") {
			tokens.push({ type: TokenType.LINEBREAK, value: "\n" })
			index++;
		} else if (input.charAt(index) == " ") {
			index++;
		} else {
			throw new Error(`Unrecognised token ${input.charAt(index)}`);
		}
	}

	return tokens;
}

export { lex }
