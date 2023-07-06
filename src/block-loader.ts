import { Blocks, FieldDropdown, FieldTextInput, Input } from "blockly";
import { ToolboxInfo, ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AutoBlocks } from "./types/auto-blocks";
import { Parameter } from "./types/new-format/parameter";
import { Scripting } from "./types/new-format/scripting";
import { RobotCommand } from "./types/robot-command";
/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 *
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 */
export function loadBlocksAutoBlocks(commandData: AutoBlocks) {
	for (const command of commandData.commands) {
		defineBlock(command.name, command);
	}
}
/**
 * Takes command data from a JSON file and generates the corresponding blocks.
 *
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 */
export function loadBlocksScripting(commandData: Scripting) {
	for (const [javaCommandName, command] of Object.entries(commandData)) {
		defineBlock(javaCommandName, command);
	}
}
/**
 * Creates a list of commands from a JSON file.
 *
 * This works with the AutoBlocks JSON format
 * @param commandData Command data from AutoBlocks JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandListAutoBlocks(
	commandData: AutoBlocks
): Array<string> {
	let commandList = [];
	for (const command of commandData.commands) {
		commandList.push(command.name);
	}
	return commandList;
}
/**
 * Creates a list of commands from a JSON file.
 *
 * This works with the scripting JSON format
 * @param commandData Command data from scripting JSON
 * @returns The list of commands in the JSON file
 */
export function generateCommandListScripting(commandData: Scripting) {
	return Object.keys(commandData);
}
/**
 * Ensures a field's value is either a number or a variable
 * @param currentValue The value of the field
 */
function fieldValidator(currentValue: string) {
	let variables = [];
	// Contains the containing method block
	let methodBlock = this.getSourceBlock().getRootBlock();
	// Get the variable attached to the method block
	let nextVariable = methodBlock.getInputTargetBlock("Variables");
	// If the method block has a variable attached to it
	if (nextVariable) {
		do {
			// Get the declared variable name and place it in the variables array
			variables.push(
				(
					nextVariable.getField("VariableDeclaration")?.getValue() as string
				).split(" ")[1]
			);
			// Check if another variable exists, if it does, keep going
			nextVariable = nextVariable.getInputTargetBlock("NextVariable");
		} while (nextVariable);
	}
	// If the current field value matches one of the variables, do nothing; the value is valid
	if (variables.find((value) => value === currentValue)) {
		return currentValue;
		// If the current field value is a number, do nothing; the value is valid
	} else if (!Number.isNaN(Number.parseFloat(currentValue))) {
		return currentValue;
		// Otherwise, remove the value
	} else {
		return null;
	}
}
/**
 * Adds a field to the given block using the parameter data
 * @param block The block to add a field to
 * @param parameter Parameter data
 */
function generateParameter(block: Input, parameter: Parameter) {
	let options: any = [];
	switch (parameter.type) {
		// Create a dropdown using the specified options
		case "select":
		case "enum":
			for (const option of parameter.options!) {
				options.push([option, option.toLocaleUpperCase()]);
			}
			block.appendField(new FieldDropdown(options), parameter.name);
			break;
		case "number":
			block.appendField(new FieldTextInput(0, fieldValidator), parameter.name);
			break;
		case "javaObject":
		case "raw":
			block.appendField(new FieldTextInput(), parameter.name);
			break;
		default:
			block.appendField("");
			break;
	}
}
/**
 * Defines a block with the Java command name as the block name and using the command definition to define parameters
 * @param commandName The command name in Java
 * @param command The command definition
 */
function defineBlock(commandName: string, command: RobotCommand) {
	Blocks[commandName] = {
		init: function () {
			// Creates a label for this block, which is the name specified in JSON
			let block = this.appendDummyInput().appendField(commandName);
			// Generate a new input for all the parameters
			for (const parameter of command.parameters) {
				generateParameter(block, parameter);
			}
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour((commandName.length * 142) % 360);
		}
	};
}
/**
 * A toolbox contains all the blocks that have been made available for use.
 *
 * This takes an array of strings containing the name of commands and methods,
 * and uses it to generate a toolbox with all the matching blocks.
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
	// Create a method category, and initialize it with the Method block
	let methodCategory: Category = {
		kind: "category",
		name: "Methods",
		contents: [
			{ kind: "block", type: "Method" },
			{ kind: "block", type: "Variable" }
		]
	};
	// If there's methods available, add them to the category
	if (methods) {
		for (const method of methods) {
			let block: ToolboxItemInfo = { kind: "block", type: method };
			methodCategory.contents.push(block);
		}
	}
	// Create a command category
	let commandCategory: Category = {
		kind: "category",
		name: "Commands",
		contents: []
	};
	// Add commands to command category
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
