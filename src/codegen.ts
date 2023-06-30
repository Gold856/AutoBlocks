import { Block, Generator } from "blockly";
import { CommandData } from "./types/command-data";
import { Root } from "./types/new-format/root";
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
	const nextBlock = block.nextConnection?.targetBlock();
	if (nextBlock && !thisOnly) {
		// @ts-ignore
		return code + "),\n" + this.blockToCode(nextBlock);
		// Methods don't allow connections and are not to be modified
	} else if (block.nextConnection == null) {
		return code;
	}
	// Otherwise, close the command
	return code + ")";
};
scriptGenerator.INDENT = "	";
scriptGenerator.scrub_ = function processScriptCommandCode(
	this: Generator,
	block: Block,
	code: string,
	thisOnly?: boolean
): string {
	// If there's a connected block, and all attached blocks should have code generated,
	// then go to the next line and place the code of the next block
	// @ts-ignore
	const nextBlock = block.nextConnection?.targetBlock();
	if (nextBlock && !thisOnly) {
		// @ts-ignore
		return `${code}\n${this.blockToCode(nextBlock)}`;
	} else {
		return code;
	}
};
/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * Code emitted is script code, and this works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @param generator A code generator
 */
export function scriptCommandCodeGen(commandData: Root, generator: Generator) {
	let commands = commandData.commands;
	// Iterate over each command
	for (const [javaCommandName, command] of Object.entries(commands)) {
		const params = command.parameters;
		// @ts-ignore
		generator[javaCommandName] = (block: Block) => {
			let code = command.name;
			for (const parameter of Object.values(params)) {
				// Value from user
				let argument = block.getFieldValue(parameter.name);
				// If the parameter is an enum, the name is the class the enum belongs to, so append it before the selected option
				if (parameter.type == "select") {
					let enumValue: string = command.prefix + `.${argument}`;
					code += " " + enumValue;
					// Otherwise, just append the argument
				} else {
					code += " " + argument;
				}
			}
			return code;
		};
	}
}
/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * Code emitted is Java code, and this works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 * @param generator A code generator
 */
export function javaAutoBlocksCommandCodeGen(
	commandData: CommandData,
	generator: Generator
) {
	let commands = commandData.commands;
	// Iterate over each command
	for (const command of commands) {
		const params = command.parameters;
		// For each command, generate the Java code associated with it
		// @ts-ignore
		generator[command.name] = (block: Block) => {
			let code: string = `new ${command.name}(`;
			// Loop over each parameter to handle enums and commas
			for (let index = 0; index < params.length; index++) {
				const parameter = params[index];
				// Value from user
				let argument = block.getFieldValue(parameter.name);
				// If the parameter is an enum, the name is the class the enum belongs to, so append it before the selected option
				if (parameter.type == "enum") {
					let enumValue: string = parameter.prefix + `.${argument}`;
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
/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * Code emitted is Java code, and this works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @param generator A code generator
 */
export function javaScriptingCommandCodeGen(
	commandData: Root,
	generator: Generator
) {
	let commands = commandData.commands;
	// Iterate over each command
	for (const [javaCommandName, command] of Object.entries(commands)) {
		const params = command.parameters;
		// @ts-ignore
		generator[javaCommandName] = (block: Block) => {
			let code = `new ${javaCommandName}(`;
			for (let index = 0; index < Object.values(params).length; index++) {
				const parameter = Object.values(params)[index];
				// Value from user
				let argument = block.getFieldValue(parameter.name);
				// If the parameter is an enum, the name is the class the enum belongs to, so append it before the selected option
				if (parameter.type == "select") {
					let enumValue: string = command.prefix + `.${argument}`;
					code += enumValue;
					// Otherwise, just append the argument
				} else {
					code += argument;
				}
				// Check if we need to add commas, either it's one arg, or we have no more params
				if (
					Object.values(params).length == 1 ||
					Object.values(params).length - 1 == index
				) {
				} else {
					code += ",";
				}
			}
			return code;
		};
	}
}
