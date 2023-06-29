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
// Add text node to code output element
document.getElementById("code")!.append("");

workspace.addChangeListener((event: any) => {
	// If there's anything happens to a block or we load a new workspace, regenerate code
	if (
		event instanceof Blockly.Events.BlockBase ||
		event instanceof Blockly.Events.FinishedLoading
	) {
		// Select text node and place code there
		document.getElementById("code")!.childNodes[1].textContent =
			generator.workspaceToCode(workspace);
	}
});
// Makes copy button copy code to clipboard
document.getElementById("code")!.addEventListener("click", () => {
	// Blockly will automatically intercept copy and paste shortcuts so you can copy and paste blocks.
	// The selected block needs to be deselected to allow you to select and copy the text in the code area.
	Blockly.getSelected()?.unselect();
});
// Clicking the copy button will automatically place the code in your clipboard
document
	.getElementById("copyButton")!
	.addEventListener("click", () =>
		navigator.clipboard.writeText(generator.workspaceToCode(workspace))
	);
window.addEventListener("resize", () => Blockly.svgResize(workspace), false);
