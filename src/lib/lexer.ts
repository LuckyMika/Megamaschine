enum RegisterName {
	RA,
	RF,
	RB,
	RS,
	R0,
	R1,
	R2,
	R3,
}

class RegisterFile {
	private registers = new Map<RegisterName, number>();

	constructor() {
		for (const name of Object.keys(RegisterName).filter(key => isNaN(Number(key)))) {
			this.registers.set(RegisterName[name as keyof typeof RegisterName], 0)
		}
	}

	read(register: RegisterName): number {
		return this.registers.get(register)!;
	}

	write(register: RegisterName, value: number) {
		this.registers.set(register, value);
	}
}

enum Flags {
	ZERO,
	NEGATIVE,
	OVERFLOW,
	CARRY,
}

enum Mnemonic {
	// CPU Control
	HALT,
	NOOP,

	// Memory Operations
	MOVE,
	READ,

	// Stack Operations
	PUSH,
	POP,
	CALL,
	RET,

	// Math Operations
	INC,
	DEC,
	ADD,
	SUB,
	MUL,
	DIV,
	MOD,

	// Bitwise Operations
	AND,
	OR,
	XOR,
	NEG,
	SHL,
	SHR,
	ROTL,
	ROTR,

	// Control Flow Operations
	COMP,
	JUMP,

}

enum TokenType {
	IDENTIFIER,
	LITERAL,
	BASE,
	DEREF,
	COMMA,
	COLON,
	COMMENT,
}

type Token =
	| { type: TokenType.IDENTIFIER, value: string }
	| { type: TokenType.LITERAL, value: string }
	| { type: TokenType.BASE, value: "#" | "$" | "b" | "" }
	| { type: TokenType.DEREF, value: "*" }
	| { type: TokenType.COMMA, value: "," }
	| { type: TokenType.COLON, value: ":" }
	| { type: TokenType.COMMENT, value: string }

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
