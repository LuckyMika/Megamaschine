import { Mnemonic, RegisterName, TokenType, type Token } from "./types";
import { isEnumKey, stringToBase } from "./utilities";

type Program = Line[]

type Line = {
	type: "label",
	value: string,
} | {
	type: "instruction",
	value: Instruction,
}

type Instruction = {
	mnemonic: Mnemonic,
	operand1?: Operand,
	operand2?: Operand,
}

type Operand = {
	type: "literal",
	value: number,
} | {
	type: "register",
	value: RegisterName,
} | {
	type: "register_reference",
	value: RegisterName,
} | {
	type: "literal_reference",
	value: number,
}

class Parser {
	private tokens: Token[]
	private pos = 0

	constructor(tokens: Token[]) {
		this.tokens = tokens
	}

	peek(offset = 0): Token | undefined {
		while (this.tokens[this.pos + offset]?.type == TokenType.COMMENT && this.pos + offset < this.tokens.length) {
			offset++;
		}

		if (this.tokens[this.pos + offset]?.type == TokenType.COMMENT) return undefined;

		return this.tokens[this.pos + offset]
	}

	consume(): Token | undefined {
		while (this.tokens[this.pos]?.type == TokenType.COMMENT && this.pos < this.tokens.length) {
			this.pos++;
		}

		return this.tokens[this.pos++]
	}

	match(type: TokenType): boolean {
		if (this.peek()?.type === type) {
			this.consume()
			return true
		}
		return false
	}

	expect(type: TokenType, msg?: string): Token {
		const tok = this.peek()
		if (tok?.type !== type) {
			throw new Error(msg ?? `Expected ${type}, got ${tok?.type}`)
		}
		return this.consume()!
	}

	parseProgram(): Program {
		const lines: Line[] = [];

		while (this.peek() != undefined) {
			const result = this.parseLine();

			if (result != undefined) {
				lines.push(result);
			}
			this.consume();
		}

		return lines;
	}

	parseLine(): Line | undefined {
		if (this.peek()?.type == TokenType.LINEBREAK) {
			return undefined;
		}

		if (this.peek()?.type != TokenType.IDENTIFIER) {
			this.expect(TokenType.IDENTIFIER);
		}

		if (this.peek(1)?.type == TokenType.COLON) {
			const identifier = this.consume()!
			this.consume()

			return { type: "label", value: identifier.value }
		} else if (this.peek(1)?.type != TokenType.COMMA) {
			return { type: "instruction", value: this.parseInstruction() }
		} else {
			throw new Error("Didn't expect COMMA!");
		}
	}

	parseInstruction(): Instruction {
		let mnemonic_string = this.expect(TokenType.IDENTIFIER).value.toUpperCase();

		if (isEnumKey(Mnemonic, mnemonic_string)) {
			let mnemonic = Mnemonic[mnemonic_string];

			if (mnemonic == Mnemonic.HALT || mnemonic == Mnemonic.NOOP) return { mnemonic: mnemonic }

			if (mnemonic == Mnemonic.MOVE || mnemonic == Mnemonic.MOD
				|| mnemonic == Mnemonic.ADD || mnemonic == Mnemonic.SUB
				|| mnemonic == Mnemonic.MUL || mnemonic == Mnemonic.DIV
				|| mnemonic == Mnemonic.AND || mnemonic == Mnemonic.OR
				|| mnemonic == Mnemonic.XOR || mnemonic == Mnemonic.NEG
				|| mnemonic == Mnemonic.SHL || mnemonic == Mnemonic.SHR
				|| mnemonic == Mnemonic.ROTR || mnemonic == Mnemonic.ROTL
			) {
				const operand1 = this.parseOperand();

				this.expect(TokenType.COMMA);

				const operand2 = this.parseOperand();

				return { mnemonic: mnemonic, operand1, operand2 }
			}

			if (mnemonic == Mnemonic.PUSH || mnemonic == Mnemonic.INC
				|| mnemonic == Mnemonic.DEC || mnemonic == Mnemonic.CMP
				|| mnemonic == Mnemonic.JMP || mnemonic == Mnemonic.JEQ
				|| mnemonic == Mnemonic.JNE || mnemonic == Mnemonic.JOF
				|| mnemonic == Mnemonic.JGT || mnemonic == Mnemonic.JLT
				|| mnemonic == Mnemonic.JGE || mnemonic == Mnemonic.JLE
			) {
				const operand1 = this.parseOperand();

				return { mnemonic: mnemonic, operand1 }
			}

			if (mnemonic == Mnemonic.POP || mnemonic == Mnemonic.RET) {
				if (this.peek()?.type != TokenType.LINEBREAK && this.peek() != undefined) {
					return { mnemonic: mnemonic, operand1: this.parseOperand() }
				}

				return { mnemonic: mnemonic }
			}

			throw new Error(`Unhandled mnemonic ${mnemonic_string}`);
		} else {
			throw new Error(`Unrecognised mnemonic ${mnemonic_string}`);
		}
	}

	parseOperand(): Operand {
		if (this.peek() == undefined) {
			throw new Error("Expected an operand");
		}

		const token = this.consume()!;

		if (token.type == TokenType.LITERAL) {
			return { type: "literal", value: parseInt(token.value) }
		}

		if (token.type == TokenType.BASE) {
			const literal = this.expect(TokenType.LITERAL);

			return { type: "literal", value: parseInt(literal.value, stringToBase(token.value)) }
		}

		if (token.type == TokenType.DEREF) {
			if (this.peek() == undefined) {
				throw new Error("Expected an reference");
			}

			const next = this.consume()!;
			let base = 10;

			if (next.type == TokenType.BASE) {
				base = stringToBase(next.value);
			} else if (next.type == TokenType.LITERAL) {
				return { type: "literal_reference", value: parseInt(next.value) }
			} else if (next.type == TokenType.IDENTIFIER) {
				if (isEnumKey(RegisterName, next.value)) {
					return { type: "register_reference", value: RegisterName[next.value] }
				}

				throw new Error(`Invalid register name, got ${next.value}`);
			} else {
				throw new Error(`Invalid operand format, got ${token.type}`);
			}

			const value = this.expect(TokenType.LITERAL).value;
			return { type: "literal_reference", value: parseInt(value, base) }
		}

		if (token.type == TokenType.IDENTIFIER) {
			if (isEnumKey(RegisterName, token.value)) {
				return { type: "register", value: RegisterName[token.value] }
			}

			throw new Error(`Invalid register name, got ${token.value}`);
		}


		throw new Error(`Invalid operand, got ${token.type}`)
	}
}

export { Parser }
