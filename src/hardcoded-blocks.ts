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
			this.appendDummyInput("CommandName").appendField("ParallelCommandGroup");
			this.appendStatementInput("commands").setCheck(null);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	Blockly.Blocks["ParallelDeadlineGroup"] = {
		init: function () {
			this.appendDummyInput().appendField("ParallelDeadlineGroup");
			this.appendStatementInput("commands").setCheck(null);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	Blockly.Blocks["ParallelRaceGroup"] = {
		init: function () {
			this.appendDummyInput().appendField("ParallelRaceGroup");
			this.appendStatementInput("commands").setCheck(null);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	Blockly.Blocks["SequentialCommandGroup"] = {
		init: function () {
			this.appendDummyInput().appendField("SequentialCommandGroup");
			this.appendStatementInput("commands").setCheck(null);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
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
		return `public static Command ${methodName}() {
			return${commands};
		}`;
	}; // @ts-ignore
	scriptGenerator["ParallelCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return "parallel\n" + scriptGenerator.statementToCode(block, "commands");
	};
	// @ts-ignore
	scriptGenerator["SequentialCommandGroup"] = (block: Block): string => {
		// Prefix the generated code with the constructor and add commands from attached blocks
		return "sequential\n" + scriptGenerator.statementToCode(block, "commands");
	};
	// @ts-ignore
	scriptGenerator["Method"] = (block: Block): string => {
		const methodName = block.getFieldValue("MethodName");
		const commands = scriptGenerator.statementToCode(block, "commands");
		return `${methodName}\n${commands}`;
	};
}
