import * as Blockly from "blockly";
import { ToolboxInfo, ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { CommandData } from "./types/command-data";
import { Root } from "./types/new-format/root";
import { Parameter } from "./types/new-format/parameter";
import { RobotCommand } from "./types/robot-command";
function parameterGenerator(block: any, parameter: Parameter) {
	let options: any = [];
	switch (parameter.type) {
		// Create a dropdown using the specified options
		case "select":
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
 * Defines Blockly blocks with the Java command name as the block name and using the command definition to define parameters
 * @param commandName The command name in Java
 * @param command The command definition
 */
function defineBlocks(commandName: string, command: RobotCommand) {
	Blockly.Blocks[commandName] = {
		init: function () {
			// Creates a label for this block, which is the name specified in JSON
			let block = this.appendDummyInput().appendField(commandName);
			// Generate a new input for all the parameters
			for (const parameter of command.parameters) {
				parameterGenerator(block, parameter);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
		}
	};
}
/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 */
export function loadBlocksAutoBlocks(commandData: CommandData) {
	/** Loop over the array of commands */
	for (const command of commandData.commands) {
		defineBlocks(command.name, command);
	}
}
/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 */
export function loadBlocksScripting(commandData: Root) {
	// Loop over all commands
	for (const [javaCommandName, command] of Object.entries(
		commandData.commands
	)) {
		defineBlocks(javaCommandName, command);
	}
}
/**
 * Creates a list of commands from a JSON file.
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandListAutoBlocks(
	commandData: CommandData
): Array<string> {
	let commandList = [];
	for (const command of commandData.commands) {
		commandList.push(command.name);
	}
	return commandList;
}
/**
 * Creates a list of commands from a JSON file.
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandListScripting(commandData: Root) {
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
export function createToolbox(
	commands: Array<string>,
	methods?: Array<string>
): ToolboxInfo {
	// Toolboxes start with this structure
	let toolbox: { kind: string; contents: ToolboxItemInfo[] } = {
		kind: "categoryToolbox",
		contents: []
	};
	let methodCategory: Category = {
		kind: "category",
		name: "Methods",
		contents: [{ kind: "block", type: "Method" }]
	};
	if (methods) {
		for (const method of methods) {
			let block: ToolboxItemInfo = { kind: "block", type: method };
			methodCategory.contents.push(block);
		}
	}
	// Create a command category, and initialize it with the Method block
	let commandCategory: Category = {
		kind: "category",
		name: "Commands",
		contents: []
	};
	// Then we push more blocks to the contents array
	for (const command of commands) {
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
	toolbox.contents.push(commandGroupCategory, commandCategory, methodCategory);
	return toolbox;
}
interface Category {
	kind: string;
	name: string;
	contents: ToolboxItemInfo[];
}
