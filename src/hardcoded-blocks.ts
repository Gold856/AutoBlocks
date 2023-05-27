import * as Blockly from 'blockly';

/**
 * Initializes blocks that are always in the workspace, such as command groups
 * <p>
 * 
 * All hardcoded blocks should be added here.
 */
export function initHardcodedBlocks() {
	Blockly.Blocks['ParallelCommandGroup'] = {
		init: function () {
			this.appendDummyInput()
				.appendField("ParallelCommandGroup");
			this.appendStatementInput("commands")
				.setCheck(null);
			this.setPreviousStatement(true, null);
			this.setNextStatement(true, null);
			this.setColour(230);
			this.setTooltip("");
			this.setHelpUrl("");
		}
	};
}