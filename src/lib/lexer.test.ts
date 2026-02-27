import { describe, expect, it } from "vitest";
import { lex } from "./lexer";
import { TokenType } from "./types";

describe("lex", () => {
	it("converts source code into a token array", () => {
		expect(lex("halt")).toStrictEqual([{ type: TokenType.IDENTIFIER, value: "halt" }])
		expect(lex("101")).toStrictEqual([{ type: TokenType.LITERAL, value: "101" }])
		expect(lex("$101")).toStrictEqual([{ type: TokenType.BASE, value: "$" }, { type: TokenType.LITERAL, value: "101" }])
		expect(lex("; Hi this is a comment")).toStrictEqual([{ type: TokenType.COMMENT, value: " Hi this is a comment" }])
		expect(lex("\n")).toStrictEqual([{ type: TokenType.LINEBREAK, value: "\n" }])

		expect(lex("mov RA, #A")).toStrictEqual([
			{ type: TokenType.IDENTIFIER, value: "mov" },
			{ type: TokenType.IDENTIFIER, value: "RA" },
			{ type: TokenType.COMMA, value: "," },
			{ type: TokenType.BASE, value: "#" },
			{ type: TokenType.LITERAL, value: "A" },
		])
	})
})
