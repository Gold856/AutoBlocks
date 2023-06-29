import * as Blockly from "blockly";
import { createToolbox, gen, load } from "./block-loader";
import { javaGenerator, javaScriptingCommandCodeGen } from "./codegen";
import { initHardcodedBlocks } from "./hardcoded-blocks";
import { activateJsonLoader } from "./json-loader";
import "./style.css";
import test from "./testcommandlist.json" assert { type: "json" };
initHardcodedBlocks();
load(test);
let generator = javaGenerator;
const toolbox = createToolbox(gen(test));
const blocklyDiv = document.getElementById("blocklyDiv")!;
const workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
activateJsonLoader(workspace);
javaScriptingCommandCodeGen(test, generator);
workspace.addChangeListener((event: any) => {
	if (
		(event instanceof Blockly.Events.BlockBase &&
			!(event instanceof Blockly.Events.BlockCreate)) ||
		event instanceof Blockly.Events.FinishedLoading
	) {
		// Select text node and place code there
		document.getElementById("code")!.childNodes[1].textContent =
			generator.workspaceToCode(workspace);
	}
});
document.getElementById("code")!.addEventListener("click", () => {
	navigator.clipboard.writeText(generator.workspaceToCode(workspace));
	Blockly.getSelected()?.unselect();
});
// Add text node to code output element
document.getElementById("code")!.append("");
Blockly.svgResize(workspace);
window.addEventListener("resize", () => Blockly.svgResize(workspace), false);
