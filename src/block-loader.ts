import * as Blockly from 'blockly';
import { ToolboxInfo, ToolboxItemInfo } from 'blockly/core/utils/toolbox';
import test from "./testcommandlist.json";
import { CommandData } from "./types/command-data";
import { Root } from './types/new-format/root';
import { Parameter } from "./types/parameter";
/**
 * Takes command data from a JSON file and generates the corresponding blocks
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
							block.appendField(new Blockly.FieldTextInput(), parameter.name);
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
export function load(commandData: Root) {
	// Loop over all commands
	for (const [commandName, command] of Object.entries(commandData.commands)) {
		Blockly.Blocks[commandName] = {
			init: function () {
				// Creates a label for this block, which is the name specified in JSON
				let block = this.appendDummyInput().appendField(commandName);
				// if (Object.is(command.parameters, {})) { return; }
				for (const [parameterName, parameter] of Object.entries(command.parameters)) {
					switch (parameter.type) {
						case "select":
							let options: any = [];
							for (const [key, option] of Object.entries(parameter.options!)) {
								options.push([option, option.toLocaleUpperCase()]);
							}
							block.appendField(new Blockly.FieldDropdown(options), parameter.name)
							break;
						case "number":
							block.appendField(new Blockly.FieldNumber(0), parameter.name);
							break;
						case "javaObject":
							block.appendField(new Blockly.FieldTextInput(), parameter.name);
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

export function gen(commandData) {
	let commandList = [];
	let commands = commandData.commands;
	for (const [commandName, command] of Object.entries(commandData.commands)) {
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
	let toolbox: { kind: string, contents: ToolboxItemInfo[] } = {
		"kind": "categoryToolbox",
		"contents": []
	}
	let commandCategory: { kind: string, name: string, contents: ToolboxItemInfo[] } = {
		"kind": "category", "name": "Commands", "contents": [
			{ "kind": "block", "type": "Method" }]
	}
	// Then we push more blocks to the contents array
	for (let index = 0; index < commands.length; index++) {
		const command = commands[index];
		let block: ToolboxItemInfo = { "kind": "block", "type": command };
		commandCategory.contents.push(block);
	}
	let commandGroupCategory = {
		"kind": "category", "name": "Command Groups", "contents": [{ "kind": "block", "type": "ParallelCommandGroup" },
		{ "kind": "block", "type": "ParallelDeadlineGroup" },
		{ "kind": "block", "type": "ParallelRaceGroup" },
		{ "kind": "block", "type": "SequentialCommandGroup" }]
	}
	toolbox.contents.push(commandGroupCategory, commandCategory);
	return toolbox;
}