import { serialization, WorkspaceSvg } from "blockly";
import {
	createToolbox,
	generateCommandListScripting,
	generateCommandListAutoBlocks,
	loadBlocksScripting,
	loadBlocksAutoBlocks
} from "./block-loader";
import {
	defineJavaCodeGenAutoBlocks,
	defineJavaCodeGenScripting,
	defineScriptCodeGenAutoBlocks,
	defineScriptCodeGenScripting,
	javaGenerator,
	scriptGenerator
} from "./codegen";
import { AutoBlocks } from "./types/auto-blocks";
import { Scripting } from "./types/new-format/scripting";
const jsonInput = document.getElementById("fileInput")! as HTMLInputElement;
const saveButton = document.getElementById(
	"saveWorkspace"
)! as HTMLButtonElement;
const workspaceLoadButton = document.getElementById(
	"loadWorkspace"
)! as HTMLInputElement;
const commandFileReader = new FileReader();
const workspaceFileReader = new FileReader();
/**
 * Allows JSON files to be read and the workspace to be changed when a JSON file is read
 * @param workspace The blockly workspace
 */
export function activateJsonLoader(workspace: WorkspaceSvg) {
	// When a file of commands is selected, use the file reader to read it
	jsonInput.addEventListener("change", () => {
		const file = jsonInput.files?.item(0);
		if (file) {
			commandFileReader.readAsText(file);
		}
	});
	// When the file reader is done reading the file, update Blockly with the new commands
	commandFileReader.addEventListener("loadend", () => {
		const commandData: AutoBlocks | Scripting = JSON.parse(
			commandFileReader.result! as string
		);
		// If the commands key contains an array, it's the AutoBlocks format
		if (commandData.commands instanceof Array) {
			loadBlocksAutoBlocks(commandData as AutoBlocks);
			workspace.updateToolbox(
				createToolbox(generateCommandListAutoBlocks(commandData as AutoBlocks))
			);
			defineJavaCodeGenAutoBlocks(commandData as AutoBlocks, javaGenerator);
			defineScriptCodeGenAutoBlocks(commandData as AutoBlocks, scriptGenerator);
			// Otherwise, it's the scripting format
		} else {
			loadBlocksScripting(commandData as Scripting);
			workspace.updateToolbox(
				createToolbox(generateCommandListScripting(commandData as Scripting))
			);
			defineJavaCodeGenScripting(commandData as Scripting, javaGenerator);
			defineScriptCodeGenScripting(commandData as Scripting, javaGenerator);
		}
	});
	// Magic code to save workspace as JSON
	saveButton.addEventListener("click", () => {
		let file = new Blob(
			[JSON.stringify(serialization.workspaces.save(workspace))],
			{ type: "application/json" }
		);
		let link = document.createElement("a");
		link.id = "destroy";
		link.download = "workspace.json";
		link.href = URL.createObjectURL(file);
		link.click();
	});
	// When a workspace save is selected, use the file reader to read it
	workspaceLoadButton.addEventListener("change", () => {
		const file = workspaceLoadButton.files?.item(0);
		if (file) {
			workspaceFileReader.readAsText(file);
		}
	});
	// When the file reader is done reading the file, load the workspace
	workspaceFileReader.addEventListener("loadend", () =>
		serialization.workspaces.load(
			JSON.parse(workspaceFileReader.result! as string),
			workspace
		)
	);
}
