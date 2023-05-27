import * as Blockly from 'blockly';
import { ToolboxInfo, ToolboxItemInfo } from 'blockly/core/utils/toolbox';
import { CommandData } from "./types/command-data";
import { Parameter } from "./types/parameter";

/**
 * Takes command data from a JSON file and generates the corresponding blocks
 * @param commandData Command data from JSON
 */
export function loadBlocks(commandData: CommandData) {
	/** The array of commands */
	let commands = commandData.commands;
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		let params = command.params;
		Blockly.Blocks[command.name] = {
			init: function () {
				// Creates a label for this block, which is the name specified in JSON
				let block = this.appendDummyInput().appendField(command.name);
				for (let index = 0; index < params.length; index++) {
					const parameter: Parameter = params[index];
					switch (parameter.type) {
						case "enum":
							let options: any = [];
							for (let index = 0; index < parameter.options!.length; index++) {
								const option = parameter.options![index];
								options.push([option, option.toLocaleUpperCase()]);
							}
							block.appendField(new Blockly.FieldDropdown(options), parameter.name)
							break;
						case "number":
							block.appendField(new Blockly.FieldNumber(0), parameter.name);
							break;
						case "raw":
							block.appendField("");
							break;
						default:
							block.appendField("");
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

/**
 * Creates a list of commands from a JSON file
 * @param commandData Command data from JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandList(commandData: CommandData): Array<string> {
	let commandList = [];
	let commands = commandData.commands;
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		commandList.push(command.name);
	}
	return commandList;
}

/**
 * A toolbox contains all the blocks that have been made available for use.
 * This takes an array of strings containing the name of commands, and uses it
 * to generate a toolbox with all the matching blocks.
 * @param commands An array of command names 
 * @returns The generated toolbox
 */
export function createToolbox(commands: Array<string>): ToolboxInfo {
	// Toolboxes start with this structure
	let toolbox: { kind: string, contents: ToolboxItemInfo[] } = {
		"kind": "flyoutToolbox",
		"contents": []
	}
	// Then we push more blocks to the contents array
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		let block: ToolboxItemInfo = { "kind": "block", "type": command };
		toolbox.contents.push(block);
	}
	// Hardcoded blocks need to go here as well
	toolbox.contents.push({ "kind": "block", "type": "ParallelCommandGroup" });
	return toolbox;
}