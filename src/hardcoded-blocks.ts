import * as Blockly from "blockly";
import { javaGenerator, scriptGenerator } from "./codegen";

/**
 * Initializes blocks that are always in the workspace, such as command groups
 * <p>
 *
 * All hardcoded blocks should be added here and in block-loader.ts
 */
export function initHardcodedBlocks() {
	Blockly.Blocks["ParallelCommandGroup"] = {
		init: function () {
			blockInitFunction.call(this, "ParallelCommandGroup");
		}
	};
	Blockly.Blocks["ParallelDeadlineGroup"] = {
		init: function () {
			blockInitFunction.call(this, "ParallelDeadlineGroup");
		}
	};
	Blockly.Blocks["ParallelRaceGroup"] = {
		init: function () {
			blockInitFunction.call(this, "ParallelRaceGroup");
		}
	};
	Blockly.Blocks["SequentialCommandGroup"] = {
		init: function () {
			blockInitFunction.call(this, "SequentialCommandGroup");
		}
	};
	Blockly.Blocks["Method"] = {
		init: function () {
			this.appendDummyInput().appendField(
				new Blockly.FieldTextInput("MethodName"),
				"MethodName"
			);
			this.appendStatementInput("commands").setCheck(null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	// @ts-ignore
	javaGenerator["ParallelCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return (
			"new ParallelCommandGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["ParallelDeadlineGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return (
			"new ParallelDeadlineGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["ParallelRaceGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return (
			"new ParallelRaceGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["SequentialCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return (
			"new SequentialCommandGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["Method"] = (block: Block): string => {
		const methodName = block.getFieldValue("MethodName");
		const commands = javaGenerator.statementToCode(block, "commands");
		return `public static Command ${methodName}() {\n\treturn${commands};\n}`;
	}; // @ts-ignore
	scriptGenerator["ParallelCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "parallel\n" + nextCode;
		} else {
			return "parallel";
		}
	};
	// @ts-ignore
	scriptGenerator["ParallelDeadlineGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "parallelDeadline\n" + nextCode;
		} else {
			return "parallelDeadline";
		}
	};
	// @ts-ignore
	scriptGenerator["ParallelRaceGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "parallelRace\n" + nextCode;
		} else {
			return "parallelRace";
		}
	};
	// @ts-ignore
	scriptGenerator["SequentialCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "sequential\n" + nextCode;
		} else {
			return "sequential";
		}
	};
	// @ts-ignore
	scriptGenerator["Method"] = (block: Block): string => {
		const methodName = block.getFieldValue("MethodName");
		const commands = scriptGenerator.statementToCode(block, "commands");
		return `${methodName}\n${commands}`;
	};
}
/**
 * Initializes the hardcoded blocks
 * @param blockName The name of the block
 */
function blockInitFunction(blockName: string) {
	// @ts-ignore
	this.appendDummyInput().appendField(blockName);
	// @ts-ignore
	this.appendStatementInput("commands").setCheck(null);
	// @ts-ignore
	this.setPreviousStatement(true, null);
	// @ts-ignore
	this.setNextStatement(true, null);
	// @ts-ignore
	this.setColour(230);
	// @ts-ignore
	this.setTooltip("");
	// @ts-ignore
	this.setHelpUrl("");
}
