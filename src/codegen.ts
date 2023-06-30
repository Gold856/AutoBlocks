import { Block, Generator } from "blockly";
import { AutoBlocks } from "./types/auto-blocks";
import { Command } from "./types/new-format/command";
import { Parameter } from "./types/new-format/parameter";
import { Scripting } from "./types/new-format/scripting";
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
 * Defines how script code should be generated for each command in the command data.
 *
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @param generator A code generator
 */
export function defineScriptCodeGenScripting(
	commandData: Scripting,
	generator: Generator
) {
	let commands = commandData.commands;
	for (const [javaCommandName, command] of Object.entries(commands)) {
		defineScriptCodegen(javaCommandName, command, generator);
	}
}
/**
 * Defines how script code should be generated for each command in the command data.
 *
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 * @param generator A code generator
 */
export function defineScriptCodeGenAutoBlocks(
	commandData: AutoBlocks,
	generator: Generator
) {
	let commands = commandData.commands;
	for (const command of commands) {
		defineScriptCodegen(command.name, command, generator);
	}
}
/**
 * Defines how Java code should be generated for each command in the command data.
 *
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 * @param generator A code generator
 */
export function defineJavaCodeGenAutoBlocks(
	commandData: AutoBlocks,
	generator: Generator
) {
	let commands = commandData.commands;
	for (const command of commands) {
		const params = command.parameters;
		// For each command, generate the Java code associated with it
		defineJavaCodegen(command.name, params, generator);
	}
}
/**
 * Defines how Java code should be generated for each command in the command data.
 *
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @param generator A code generator
 */
export function defineJavaCodeGenScripting(
	commandData: Scripting,
	generator: Generator
) {
	let commands = commandData.commands;
	for (const [javaCommandName, command] of Object.entries(commands)) {
		const params = command.parameters;
		defineJavaCodegen(javaCommandName, params, generator);
	}
}
/**
 * Uses command data to define how a command is converted to script code
 * @param javaCommandName The name of the command in Java
 * @param command Command data
 * @param generator Code generator
 */
function defineScriptCodegen(
	javaCommandName: string,
	command: Command,
	generator: Generator
) {
	const params = command.parameters;
	// @ts-ignore
	generator[javaCommandName] = (block: Block) => {
		let code = command.name;
		for (const parameter of params) {
			// Value from user
			let argument = block.getFieldValue(parameter.name);
			// If the parameter is an enum, the prefix is the class the enum belongs to, so append it before the selected option
			if (parameter.type == "select") {
				let enumValue: string = parameter.prefix + `.${argument}`;
				code += " " + enumValue;
				// Otherwise, just append the argument
			} else {
				code += " " + argument;
			}
		}
		return code;
	};
}
/**
 * Uses command data to define how a command is converted to Java code
 * @param javaCommandName The name of the command in Java
 * @param params Parameter data
 * @param generator Code generator
 */
function defineJavaCodegen(
	javaCommandName: string,
	params: Parameter[],
	generator: Generator
) {
	// @ts-ignore
	generator[javaCommandName] = (block: Block) => {
		let code = `new ${javaCommandName}(`;
		for (let index = 0; index < params.length; index++) {
			const parameter = params[index];
			// Value from user
			let argument = block.getFieldValue(parameter.name);
			// If the parameter is an enum, the prefix is the class the enum belongs to, so append it before the selected option
			if (parameter.type == "select") {
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
		return code;
	};
}
