import { serialization, WorkspaceSvg } from "blockly";
import { createToolbox, gen, load } from "./block-loader";
import { javaCommandCodeGen, javaGenerator } from "./codegen";
import { CommandData } from "./types/command-data";
export const input = document.getElementById("fileInput")! as HTMLInputElement;
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
	commandFileReader.addEventListener("loadend", () => {
		const commandData: CommandData = JSON.parse(
			commandFileReader.result! as string
		);
		load(commandData);
		workspace.updateToolbox(createToolbox(gen(commandData)));
		javaCommandCodeGen(commandData, javaGenerator);
	});
	input.addEventListener("change", () => {
		const file = input.files?.item(0);
		if (file) {
			commandFileReader.readAsText(file);
		}
	});
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
	workspaceLoadButton.addEventListener("change", () => {
		const file = workspaceLoadButton.files?.item(0);
		if (file) {
			workspaceFileReader.readAsText(file);
		}
	});
	workspaceFileReader.addEventListener("loadend", () =>
		serialization.workspaces.load(
			JSON.parse(workspaceFileReader.result! as string),
			workspace
		)
	);
}
