import * as Blockly from "blockly";
import { javaGenerator, scriptGenerator } from "./codegen";

/**
 * Initializes blocks that are always in the workspace, such as command groups
 * <p>
 *
 * All hardcoded blocks should be added here and in block-loader.ts
 */
export function initHardcodedBlocks() {
	// Initialize blocks
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
			this.appendValueInput("Variables").appendField(
				new Blockly.FieldTextInput("MethodName"),
				"MethodName"
			);
			this.appendStatementInput("commands").setCheck(null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	Blockly.Blocks["Variable"] = {
		init: function () {
			this.appendValueInput("NextVariable")
				.setCheck(null)
				.appendField(
					new Blockly.FieldTextInput("variable"),
					"VariableDeclaration"
				);
			this.setInputsInline(false);
			this.setOutput(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
	// Initialize Java codegen for blocks
	// @ts-ignore
	javaGenerator["ParallelCommandGroup"] = (block: Block): string => {
		// Prefix the generated code from the attached blocks with the constructor
		return (
			"new ParallelCommandGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["ParallelDeadlineGroup"] = (block: Block): string => {
		// Prefix the generated code from the attached blocks with the constructor
		return (
			"new ParallelDeadlineGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["ParallelRaceGroup"] = (block: Block): string => {
		// Prefix the generated code from the attached blocks with the constructor
		return (
			"new ParallelRaceGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["SequentialCommandGroup"] = (block: Block): string => {
		// Prefix the generated code from the attached blocks with the constructor
		return (
			"new SequentialCommandGroup(\n" +
			javaGenerator.statementToCode(block, "commands")
		);
	};
	// @ts-ignore
	javaGenerator["Method"] = (block: Block): string => {
		const methodName = block.getFieldValue("MethodName");
		const variables = javaGenerator.valueToCode(block, "Variables", 0);
		const commands = javaGenerator.statementToCode(block, "commands");
		return `public static Command ${methodName}(${variables}) {\n\treturn${commands};\n}`;
	};
	// @ts-ignore
	javaGenerator["Variable"] = (block: Blockly.Block) => {
		const variableDeclaration = block.getFieldValue("VariableDeclaration");
		const code = javaGenerator.valueToCode(block, "NextVariable", 0);
		if (code) {
			return [`${variableDeclaration}, ${code}`, 0];
		} else {
			return [variableDeclaration, 0];
		}
	};
	// Initialize script codegen for blocks
	// @ts-ignore
	scriptGenerator["ParallelCommandGroup"] = (block: Block): string => {
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		// Insert the command group name, if there's blocks in the command group,
		// go to the next line and add the code from the blocks
		if (nextCode) {
			return "parallel\n" + nextCode;
			// Otherwise, just insert the command group name
		} else {
			return "parallel";
		}
	};
	// @ts-ignore
	scriptGenerator["ParallelDeadlineGroup"] = (block: Block): string => {
		// Insert the command group name, if there's blocks in the command group,
		// go to the next line and add the code from the blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "parallelDeadline\n" + nextCode;
			// Otherwise, just insert the command group name
		} else {
			return "parallelDeadline";
		}
	};
	// @ts-ignore
	scriptGenerator["ParallelRaceGroup"] = (block: Block): string => {
		// Insert the command group name, if there's blocks in the command group,
		// go to the next line and add the code from the blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "parallelRace\n" + nextCode;
			// Otherwise, just insert the command group name
		} else {
			return "parallelRace";
		}
	};
	// @ts-ignore
	scriptGenerator["SequentialCommandGroup"] = (block: Block): string => {
		// Insert the command group name, if there's blocks in the command group,
		// go to the next line and add the code from the blocks
		const nextCode = scriptGenerator.statementToCode(block, "commands");
		if (nextCode) {
			return "sequential\n" + nextCode;
			// Otherwise, just insert the command group name
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
 * Initializes a hardcoded block
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
	this.setColour((blockName.length * 42) % 360);
	// @ts-ignore
	this.setTooltip("");
	// @ts-ignore
	this.setHelpUrl("");
}
