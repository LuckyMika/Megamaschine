import type { Operand, Program } from "./parser";

enum OperandFlags {
	PRESENT = 1 << 0,
	REFERENCE = 1 << 1,
	REGISTER = 1 << 2,

}

const assembly = new Uint8Array();
const label_map = new Map<string, number>()
let current_address = 0;
function assemble(program: Program) {
	for (const line of program) {
		if (line.type == "label") {
			if (label_map.has(line.value)) {
				throw new Error(`Redeclared label ${line.value}`);
			} else {
				label_map.set(line.value, current_address)
			}
		} else if (line.type == "instruction") {
			assembly[current_address] = line.value.mnemonic
			if (line.value.operand1 != undefined) {
				assembly[current_address + 1] |= OperandFlags.PRESENT;
				assembleOperand(line.value.operand1);
				assembly[current_address + 1] <<= 4;

				if (line.value.operand2 != undefined) {
					assembly[current_address + 1] |= OperandFlags.PRESENT;
					assembleOperand(line.value.operand2);
				}
			}
		}
	}
}

function assembleOperand(operand: Operand) {
	if (operand.type == "label") {
		if (!label_map.has(operand.value)) {
			throw new Error(`Label ${operand.type} is not defined`)
		}

	} else if (operand.type == "label_reference") {
		if (!label_map.has(operand.value)) {
			throw new Error(`Label ${operand.type} is not defined`)
		}

		assembly[current_address + 1] |= OperandFlags.REFERENCE;
		assembly[current_address + 2] = label_map.get(operand.value)!;
	} else if (operand.type == "literal") {
		assembly[current_address + 2] = operand.value
	} else if (operand.type == "literal_reference") {
		assembly[current_address + 1] |= OperandFlags.REFERENCE;
		assembly[current_address + 2] = operand.value
	} else if (operand.type == "register") {
		assembly[current_address + 1] |= OperandFlags.REGISTER;
		assembly[current_address + 2] = operand.value;
	} else if (operand.type == "register_reference") {
		assembly[current_address + 1] |= (OperandFlags.REFERENCE | OperandFlags.REGISTER);
		assembly[current_address + 2] = operand.value;
	}
}

export { assemble }
