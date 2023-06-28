import { Block, Generator } from "blockly";
import { CommandData } from "./types/command-data";
export const javaGenerator: Generator = new Generator("Java");
export const scriptGenerator: Generator = new Generator("Script");
javaGenerator.INDENT = "	";
// @ts-ignore
javaGenerator.scrub_ = function processJavaCommandCode(
	this: Generator,
	block: Block,
	code: string,
	thisOnly?: boolean
): string {
	// If there's a connected block, and all attached blocks should have code generated,
	// then close off the previous command and add a comma to include the next command
	// @ts-ignore
	const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
	if (nextBlock && !thisOnly) {
		// @ts-ignore
		return code + "),\n" + this.blockToCode(nextBlock);
		// Methods don't allow connections, and commands should've been caught before this. Methods are not to be modified
	} else if (block.nextConnection == null) {
		return code;
	}
	// Otherwise, close the command
	return code + ")\n";
};
scriptGenerator.INDENT = "	";
/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * @param commandData Command data from JSON
 * @param generator A code generator
 */
export function scriptCommandCodeGen(
	commandData: CommandData,
	generator: Generator
) {
	let commands = commandData.commands;
	// Iterate over each command
	for (const command of commands) {
		const params = command.params;
		// @ts-ignore
		generator[command.name] = (block: Block) => {
			let code = command.name;
			for (let index = 0; index < params.length; index++) {
				const parameter = params[index];
				// Value from user
				let argument = block.getFieldValue(parameter.name);
				// If the parameter is an enum, the name is the class the enum belongs to, so append it before the selected option
				if (parameter.type == "enum") {
					let enumValue: string = parameter.name + `.${argument}`;
					code += enumValue;
					// Otherwise, just append the argument
				} else {
					code += argument;
				}
				// Check if we need to add commas, either it's one arg, or we have no more params
				if (params.length == 1 || params.length - 1 == index) {
				} else {
					code += ",";
				}
			}
		};
	}
}
/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * @param commandData Command data from JSON
 * @param generator A code generator
 */
export function javaCommandCodeGen(
	commandData: CommandData,
	generator: Generator
) {
	let commands = commandData.commands;
	// Iterate over each command
	for (const command of commands) {
		const params = command.params;
		// For each command, generate the Java code associated with it
		// @ts-ignore
		generator[command.name] = (block: Block) => {
			let code: string = `new ${command.name}(`;
			// For each parameter
			for (let index = 0; index < params.length; index++) {
				const parameter = params[index];
				// Value from user
				let argument = block.getFieldValue(parameter.name);
				// If the parameter is an enum, the name is the class the enum belongs to, so append it before the selected option
				if (parameter.type == "enum") {
					let enumValue: string = parameter.name + `.${argument}`;
					code += enumValue;
					// Otherwise, just append the argument
				} else {
					code += argument;
				}
				// Check if we need to add commas, either it's one arg, or we have no more params
				if (params.length == 1 || params.length - 1 == index) {
				} else {
					code += ",";
				}
			}
			// Finish the command
			return code;
		};
	}
}
