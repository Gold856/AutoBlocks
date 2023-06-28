import * as Blockly from "blockly";
import { createToolbox, gen, load } from "./block-loader";
import { javaGenerator } from "./codegen";
import { initHardcodedBlocks } from "./hardcoded-blocks";
import { activateJsonLoader } from "./json-loader";
import "./style.css";
import test from "./testcommandlist.json" assert { type: "json" };
initHardcodedBlocks();
load(test);
const toolbox = createToolbox(gen(test));
const blocklyDiv = document.getElementById("blocklyDiv")!;
const workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
activateJsonLoader(workspace);
// javaCommandCodeGen(commandData as CommandData, javaGenerator);
workspace.addChangeListener((event: any) => {
	if (
		event instanceof Blockly.Events.BlockBase &&
		!(event instanceof Blockly.Events.BlockCreate)
	) {
		document.getElementById("code")!.innerText =
			javaGenerator.workspaceToCode(workspace);
		workspace
			.getBlocksByType("ParallelCommandGroup", true)
			.forEach((block) =>
				console.log(block.getInput("commands")?.connection?.targetBlock())
			);
	}
});
Blockly.svgResize(workspace);
window.addEventListener("resize", () => Blockly.svgResize(workspace), false);
