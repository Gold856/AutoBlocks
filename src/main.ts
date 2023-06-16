import * as Blockly from "blockly";
import { createToolbox, gen, load } from "./block-loader";
import { javaGenerator } from "./codegen";
import { initHardcodedBlocks } from "./hardcoded-blocks";
import { activateJsonLoader, input } from "./json-loader";
import "./style.css";
import test from "./testcommandlist.json" assert { type: "json" };
initHardcodedBlocks();
load(test);
const toolbox = createToolbox(gen(test));
const blocklyArea = document.getElementById("blocklyArea")!;
const blocklyDiv = document.getElementById("blocklyDiv")!;
// console.log(javaGenerator.workspaceToCode(workspace))
const workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
activateJsonLoader(workspace);
// javaCommandCodeGen(commandData as CommandData, javaGenerator);
workspace.addChangeListener((event: any) => {
	if (
		event instanceof Blockly.Events.BlockBase &&
		!(event instanceof Blockly.Events.BlockCreate)
	) {
		console.log(javaGenerator.workspaceToCode(workspace));
		workspace
			.getBlocksByType("ParallelCommandGroup", true)
			.forEach((block) =>
				console.log(block.getInput("commands")?.connection?.targetBlock())
			);
	}
});

const onresize = () => {
	// Compute the absolute coordinates and dimensions of blocklyArea.
	let element = blocklyArea;
	let x = 0;
	let y = 0;
	do {
		x += element!.offsetLeft;
		y += element!.offsetTop;
		element = element!.offsetParent as HTMLElement;
	} while (element);
	// Position blocklyDiv over blocklyArea.
	blocklyDiv.style.left = x + "px";
	blocklyDiv.style.top = y + input.offsetHeight + "px";
	blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
	blocklyDiv.style.height =
		blocklyArea.offsetHeight - input.offsetHeight - 1 + "px";
	Blockly.svgResize(workspace);
};
window.addEventListener("resize", onresize, false);
onresize();
