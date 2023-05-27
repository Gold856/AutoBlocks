import * as Blockly from 'blockly';
import { Block, Generator } from 'blockly';
import { ToolboxInfo, ToolboxItemInfo } from 'blockly/core/utils/toolbox';
import { CommandData } from "./types/command-data";
import { Parameter } from "./types/parameter";

export function loadBlocks(commandData: CommandData) {
	let commands = commandData.commands;
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		let params = command.params;
		Blockly.Blocks[command.name] = {
			init: function () {
				let field = this.appendDummyInput().appendField(command.name);
				for (let index = 0; index < params.length; index++) {
					const parameter: Parameter = params[index];
					switch (parameter.type) {
						case "enum":
							let options: any = [];
							for (let index = 0; index < parameter.options!.length; index++) {
								const option = parameter.options![index];
								options.push([option, option.toLocaleUpperCase()]);
							}
							field.appendField(new Blockly.FieldDropdown(options), parameter.name)
							break;
						case "number":
							field.appendField(new Blockly.FieldNumber(0), parameter.name);
							break;
						case "raw":
							field.appendField("");
							break;
						default:
							field.appendField("");
							break;
					}
				}
				this.setPreviousStatement(true, null);
				this.setNextStatement(true, null);
				this.setColour(230);
			}
		}
	}
}

export function generateCommandList(commandData: CommandData): Array<string> {
	let commandList = [];
	let commands = commandData.commands;
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		commandList.push(command.name);
	}
	return commandList;
}
export function codeGen(commandData: CommandData, generator: Generator) {
	let commands = commandData.commands;
	// Iterate over each command
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		let params = command.params;
		// For each command, generate the Java code associated with it 
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
/**
 * A toolbox contains all the blocks that have been made available for use.
 * This takes an array of strings containing the name of commands, and uses it
 * to generate a toolbox with all the matching blocks.
 * @param commands An array of command names 
 * @returns The generated toolbox
 */
export function createToolbox(commands: Array<string>): ToolboxInfo {
	let toolbox: { kind: string, contents: ToolboxItemInfo[] } = {
		"kind": "flyoutToolbox",
		"contents": []
	}
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		let block: ToolboxItemInfo = { "kind": "block", "type": command };
		toolbox.contents.push(block);
	}
	toolbox.contents.push({ "kind": "block", "type": "ParallelCommandGroup" });
	return toolbox;
}