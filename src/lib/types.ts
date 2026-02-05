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
	CMP,
	JMP,
	JEQ,
	JNE,
	JGE,
	JLE,
	JGT,
	JLT,
	JOF,
}

enum TokenType {
	IDENTIFIER,
	LITERAL,
	BASE,
	DEREF,
	COMMA,
	COLON,
	COMMENT,
	LINEBREAK,
}

const BASE_PREFIXES = ["b", "", "$", "#"] as const;

type Token =
	| { type: TokenType.IDENTIFIER, value: string }
	| { type: TokenType.LITERAL, value: string }
	| { type: TokenType.BASE, value: typeof BASE_PREFIXES[number] }
	| { type: TokenType.DEREF, value: "*" }
	| { type: TokenType.COMMA, value: "," }
	| { type: TokenType.COLON, value: ":" }
	| { type: TokenType.COMMENT, value: string }
	| { type: TokenType.LINEBREAK, value: "\n" }

export { type Token, TokenType, Mnemonic, Flags, RegisterFile, RegisterName, BASE_PREFIXES }
