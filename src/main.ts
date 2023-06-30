import * as Blockly from "blockly";
import {
	createToolbox,
	generateCommandListScripting,
	loadBlocksScripting
} from "./block-loader";
import {
	javaGenerator,
	defineJavaCodeGenScripting,
	defineScriptCodeGenScripting,
	scriptGenerator
} from "./codegen";
import { initHardcodedBlocks } from "./hardcoded-blocks";
import { activateJsonLoader } from "./json-loader";
import "./style.css";
import test from "./testcommandlist.json" assert { type: "json" };
initHardcodedBlocks();
loadBlocksScripting(test);
let generator = javaGenerator;
const toolbox = createToolbox(generateCommandListScripting(test));
const blocklyDiv = document.getElementById("blocklyDiv")!;
const workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });
const languageToggle = document.getElementById("languageToggle")!;
activateJsonLoader(workspace);
defineJavaCodeGenScripting(test, javaGenerator);
defineScriptCodeGenScripting(test, scriptGenerator);
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
// When the button is clicked, the language outputted switches between Java and the scripting language
languageToggle.addEventListener("click", () => {
	if (generator == javaGenerator) {
		generator = scriptGenerator;
		languageToggle.textContent = "Use Java";
	} else if (generator == scriptGenerator) {
		generator = javaGenerator;
		languageToggle.textContent = "Use Scripting";
	}
	workspace.fireChangeListener(new Blockly.Events.BlockBase());
});
window.addEventListener("resize", () => Blockly.svgResize(workspace), false);
