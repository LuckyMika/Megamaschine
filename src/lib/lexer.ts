import { TokenType, type Token } from "./types";
import { isLetter, isNumber } from "./utilities";


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
		} else if (input.charAt(index) == ",") {
			tokens.push({ type: TokenType.COMMA, value: "," });
		} else if (input.charAt(index) == ":") {
			tokens.push({ type: TokenType.COLON, value: ":" });
		} else if (input.charAt(index) == ";") {
			index++;

			let comment = input.charAt(index);

			index++;

			while (input.charAt(index) != "\n") {
				comment += input.charAt(index);
				index++;
			}

			tokens.push({ type: TokenType.COMMENT, value: comment });
		} else {
			throw new Error("Unrecognised token!");
		}
	}

	return tokens;
}

export { lex }
