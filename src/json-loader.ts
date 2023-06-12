import { WorkspaceSvg } from "blockly";
import { createToolbox, gen, generateCommandList, load, loadBlocks } from "./block-loader";
import { javaCommandCodeGen, javaGenerator } from "./codegen";
import { CommandData } from "./types/command-data";

export const input = document.getElementById("fileInput")! as HTMLInputElement;
const fileReader = new FileReader();
/**
 * Allows JSON files to be read and the workspace to be changed when a JSON file is read
 * @param workspace The blockly workspace
 */
export function activateJsonLoader(workspace: WorkspaceSvg) {
	fileReader.addEventListener("loadend", () => {
		const commandData: CommandData = JSON.parse(fileReader.result! as string);
		load(commandData);
		workspace.updateToolbox(createToolbox(gen(commandData)));
		javaCommandCodeGen(commandData, javaGenerator);
	});
	input.addEventListener("change", () => {
		const file = input.files?.item(0);
		if (file) {
			fileReader.readAsText(file);
		}
	});
}