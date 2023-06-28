import * as Blockly from "blockly";
import { ToolboxInfo, ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { CommandData } from "./types/command-data";
import { Root } from "./types/new-format/root";
import { Parameter } from "./types/parameter";
function parameterGenerator(block: any, parameter: Parameter) {
	let options: any = [];
	switch (parameter.type) {
		case "select":
			for (const option of Object.values(parameter.options!)) {
				options.push([option, option.toLocaleUpperCase()]);
			}
			block.appendField(new Blockly.FieldDropdown(options), parameter.name);
			break;
		// Create a dropdown using the specified options
		case "enum":
			for (const option of parameter.options!) {
				options.push([option, option.toLocaleUpperCase()]);
			}
			block.appendField(new Blockly.FieldDropdown(options), parameter.name);
			break;
		case "javaObject":
		case "number":
			block.appendField(new Blockly.FieldNumber(0), parameter.name);
			break;
		case "raw":
			block.appendField(new Blockly.FieldTextInput(), parameter.name);
			break;
		default:
			block.appendField("");
			break;
	}
}

/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 * This works with the AutoBlocks format
 * @param commandData Command data from JSON
 */
export function loadBlocks(commandData: CommandData) {
	/** Loop over the array of commands */
	for (const command of commandData.commands) {
		let params = command.params;
		Blockly.Blocks[command.name] = {
			init: function () {
				// Creates a label for this block, which is the name specified in JSON
				let block = this.appendDummyInput().appendField(command.name);
				// Generate a new input for all the parameters
				for (const parameter of params) {
					parameterGenerator(block, parameter);
				}
				this.setPreviousStatement(true, null);
				this.setNextStatement(true, null);
				this.setColour(230);
			}
		};
	}
}
/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 * This works with the scripting format
 * @param commandData Command data from JSON
 */
export function load(commandData: Root) {
	// Loop over all commands
	for (const [commandName, command] of Object.entries(commandData.commands)) {
		Blockly.Blocks[commandName] = {
			init: function () {
				// Creates a label for this block, which is the name specified in JSON
				let block = this.appendDummyInput().appendField(commandName);
				for (const parameter of Object.values(command.parameters)) {
					parameterGenerator(block, parameter);
				}
				this.setPreviousStatement(true, null);
				this.setNextStatement(true, null);
				this.setColour(230);
			}
		};
	}
}
/**
 * Creates a list of commands from a JSON file.
 * This works with the AutoBlocks format
 * @param commandData Command data from JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandList(commandData: CommandData): Array<string> {
	let commandList = [];
	for (const command in commandData.commands) {
		commandList.push(command.name);
	}
	return commandList;
}
/**
 * Creates a list of commands from a JSON file.
 * This works with the scripting format
 * @param commandData Command data from JSON
 * @returns The list of commands in the JSON file
 */
export function gen(commandData: Root) {
	let commandList = [];
	for (const commandName of Object.keys(commandData.commands)) {
		commandList.push(commandName);
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
	let toolbox: { kind: string; contents: ToolboxItemInfo[] } = {
		kind: "categoryToolbox",
		contents: []
	};
	// Create a command category, and initialize it with the Method block
	let commandCategory: {
		kind: string;
		name: string;
		contents: ToolboxItemInfo[];
	} = {
		kind: "category",
		name: "Commands",
		contents: [{ kind: "block", type: "Method" }]
	};
	// Then we push more blocks to the contents array
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		let block: ToolboxItemInfo = { kind: "block", type: command };
		commandCategory.contents.push(block);
	}
	// Create a hardcoded category for the command groups
	let commandGroupCategory = {
		kind: "category",
		name: "Command Groups",
		contents: [
			{ kind: "block", type: "ParallelCommandGroup" },
			{ kind: "block", type: "ParallelDeadlineGroup" },
			{ kind: "block", type: "ParallelRaceGroup" },
			{ kind: "block", type: "SequentialCommandGroup" }
		]
	};
	// Combine the categories into the toolbox
	toolbox.contents.push(commandGroupCategory, commandCategory);
	return toolbox;
}
