import { Block, Generator } from "blockly";
import { CommandData } from "./types/command-data";
export const javaGenerator: Generator = new Generator("Java");
// @ts-ignore
javaGenerator.scrub_ = javaCodegen;
// @ts-ignore
javaGenerator["ParallelCommandGroup"] = (block: Block): string => {
	let code = "new ParallelCommandGroup("
	const statement_members = javaGenerator.statementToCode(block, 'commands');
	return code + statement_members;
};
/** Handles connected blocks */
function javaCodegen(this: Generator, block: Block, code: string, thisOnly?: boolean): string {
	const nextBlock =
		block.nextConnection && block.nextConnection.targetBlock();
	// If there's a connected block, close off the previous command and add a comma to include the next command
	if (nextBlock && !thisOnly) {
		return code + '),\n' + this.blockToCode(nextBlock);
	}
	// Otherwise, close the command
	return code + ")";
}

/**
 * Takes in command data from a JSON file, and calculates the code to emit based on the parameters.
 * @param commandData Command data from JSON
 * @param generator A code generator
 */
export function codeGen(commandData: CommandData, generator: Generator) {
	let commands = commandData.commands;
	// Iterate over each command
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		let params = command.params;
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
				if (parameter.type == 'enum') {
					let enumValue: string = parameter.name + `.${argument}`;
					code += enumValue;
					// Otherwise, just append the argument
				} else {
					code += argument;
				}
				// Check if we need to add commas, either it's one arg, or we have no more params
				if (params.length == 1 || (params.length - 1) == index) {
				} else {
					code += ","
				}
			}
			// Finish the command
			return code;
		}
	}
}