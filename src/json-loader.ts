import { serialization, WorkspaceSvg } from "blockly";
import {
	createToolbox,
	gen,
	generateCommandList,
	load,
	loadBlocks
} from "./block-loader";
import { javaAutoBlocksCommandCodeGen, javaGenerator } from "./codegen";
import { CommandData } from "./types/command-data";
import { Root } from "./types/new-format/root";
const jsonInput = document.getElementById("fileInput")! as HTMLInputElement;
const saveButton = document.getElementById("save")! as HTMLButtonElement;
const workspaceLoadButton = document.getElementById(
	"load"
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
		const commandData: CommandData | Root = JSON.parse(
			commandFileReader.result! as string
		);
		if (commandData.commands instanceof Array) {
			loadBlocks(commandData as CommandData);
			workspace.updateToolbox(
				createToolbox(generateCommandList(commandData as CommandData))
			);
			javaAutoBlocksCommandCodeGen(commandData as CommandData, javaGenerator);
		} else {
			load(commandData as Root);
			workspace.updateToolbox(createToolbox(gen(commandData as Root)));
			javaAutoBlocksCommandCodeGen(commandData, javaGenerator);
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
