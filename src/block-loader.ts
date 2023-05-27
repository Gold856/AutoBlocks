import * as Blockly from 'blockly';
import { Workspace } from 'blockly';
import { ToolboxInfo, ToolboxItemInfo } from 'blockly/core/utils/toolbox';
import { CommandData } from "./types/command";
import { Parameter } from "./types/parameter";

export function loadBlocks(commandData: CommandData): Array<string> {
	let blocks: Array<string> = [];
	let commands = commandData.commands;
	const javaGenerator: Blockly.Generator = new Blockly.Generator("Java");
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		blocks.push(command.name);
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
	return blocks;
}

export function codeGen(commandData: CommandData, generator: any) {
	let blocks: Array<string> = [];
	let commands = commandData.commands;
	for (let index = 0; index < commands.length; index++) {
		let command = commands[index];
		blocks.push(command.name);
		let params = command.params;
		generator[command.name] = (block: Blockly.Block) => {
			let code: string = `new ${command.name}(`;
			for (let index = 0; index < params.length; index++) {
				const parameter = params[index];
				let argument = block.getFieldValue(parameter.name);
				if (parameter.type == 'enum') {
					let enumValue: string = parameter.name + `.${argument}`;
					code += enumValue;
				} else {
					code += argument;
				}
				// Check if we need to add commas, either it's one arg, or we have no more params
				if (params.length == 1 || (params.length - 1) == index) {
				} else {
					code += ","
				}
			}
			return code + ");";
		}
	}
}
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
	return toolbox;
}