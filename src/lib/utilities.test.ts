import { describe, expect, it } from "vitest";
import { isEnumKey, isLetter, isNumber, stringToBase } from "./utilities";
import { RegisterName } from "./types";

describe("isLetter", () => {
	it("checks whether a string is a letter", () => {
		expect(isLetter("")).toBe(false);
		expect(isLetter("-")).toBe(false);
		expect(isLetter(".")).toBe(false);
		expect(isLetter(",")).toBe(false);
		expect(isLetter(";")).toBe(false);
		expect(isLetter(":")).toBe(false);
		expect(isLetter("#")).toBe(false);
		expect(isLetter("+")).toBe(false);
		expect(isLetter("*")).toBe(false);
		expect(isLetter("~")).toBe(false);

		for (let i = 0; i < 10; i++) {
			expect(isLetter(i.toString())).toBe(false);
		}

		expect(isLetter("A")).toBe(true);
		expect(isLetter("a")).toBe(true);
		expect(isLetter("_")).toBe(true);
	})
})

describe("isNumber", () => {
	it("checks whether a string is a number", () => {
		for (let i = 0; i < 10; i++) {
			expect(isNumber(i.toString())).toBe(true);
			expect(isNumber(i.toString(), 10)).toBe(true);
		}

		expect(isNumber("")).toBe(false);
		expect(isNumber("", 10)).toBe(false);

		expect(isNumber("a")).toBe(false);
		expect(isNumber("a", 16)).toBe(true);

		expect(isNumber("A")).toBe(false);
		expect(isNumber("A", 16)).toBe(true);
	})
})

describe("stringToBase", () => {
	it("converts a string to a base prefix", () => {
		expect(stringToBase("b")).toBe(2);
		expect(stringToBase("")).toBe(10);
		expect(stringToBase("$")).toBe(10);
		expect(stringToBase("#")).toBe(16);

		// @ts-expect-error
		expect(() => stringToBase("+")).toThrow();
	})
})

describe("isEnumKey", () => {
	it("checks whether a given key can index a given enum", () => {
		for (const key of Object.values(RegisterName)) {
			// @ts-expect-error
			expect(isEnumKey(RegisterName, key)).toBe(true)
		}
	})
}) 
